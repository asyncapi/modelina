/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 * 
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 * 
 */

import * as path from 'path';
import * as fs from 'fs';
import { defaultRustRenderCompleteModelOptions, InputMetaModel, InputProcessor, RustFileGenerator, RustPackageFeatures, RustRenderCompleteModelOptions } from '../../src';
import { execCommand } from './utils/Utils';
import filesToTest from './BlackBoxTestFiles';
// eslint-disable-next-line no-console
console.log('This is gonna take some time, Stay Awhile and Listen');
describe.each(filesToTest)('Should be able to generate with inputs', ({ file, outputDirectory }) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  const outputDirectoryPath = path.resolve(__dirname, outputDirectory, 'rust');
  let models: InputMetaModel;
  beforeAll(async () => {
    if (fs.existsSync(outputDirectoryPath)) {
      fs.rmSync(outputDirectoryPath, { recursive: true });
    }
    const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
    const processor = new InputProcessor();
    const input = JSON.parse(String(inputFileContent));
    models = await processor.process(input);
  });
  describe(file, () => {
    describe.skip('should be able to generate Rust', () => {
      test('struct with serde_json', async () => {
        const generator = new RustFileGenerator();
        const renderOutputPath = path.resolve(outputDirectoryPath, './struct');
        const cargoFile = path.resolve(outputDirectoryPath, './struct/Cargo.toml');
        const options = {
          ...defaultRustRenderCompleteModelOptions,
          supportFiles: true, // generate Cargo.toml and lib.rs
          package: {
            packageName: 'asyncapi-rs-example',
            packageVersion: '1.0.0',
            // set authors, homepage, repository, and license
            authors: ['AsyncAPI Rust Champions'],
            homepage: 'https://www.asyncapi.com/tools/modelina',
            repository: 'https://github.com/asyncapi/modelina',
            license: 'Apache-2.0',
            description: 'Rust models generated by AsyncAPI Modelina',
            // support 2018 editions and up
            edition: '2018',
            // enable serde_json
            packageFeatures: [RustPackageFeatures.json] as RustPackageFeatures[]
          }
        } as RustRenderCompleteModelOptions;
        const generatedModels = await generator.generateToPackage(models, renderOutputPath, options);
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `cargo build --manifest-path=${cargoFile}`;
        await execCommand(compileCommand, true);
      });
    });
  });
});
