/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 * 
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 * 
 */

import * as path from 'path';
import * as fs from 'fs';
import { CSharpFileGenerator, GoFileGenerator, InputMetaModel, InputProcessor, JavaFileGenerator, JAVA_COMMON_PRESET } from '../../src';
import { execCommand } from './utils/Utils';
const ignoreTestIf = (condition: boolean) => condition ? test.skip : test;
import filesToTest from './BlackBoxTestFiles';
// eslint-disable-next-line no-console
console.log('This is gonna take some time, Stay Awhile and Listen');
describe.each(filesToTest)('Should be able to generate with inputs', ({ file, outputDirectory }) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  const outputDirectoryPath = path.resolve(__dirname, outputDirectory, 'go');
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
    describe('should be able to generate Go', () => {
      test('struct', async () => {
        const generator = new GoFileGenerator();
        const renderOutputPath = path.resolve(outputDirectoryPath, './struct/');

        const generatedModels = await generator.generateToFiles(models, renderOutputPath, { packageName: 'test_package_name' }, true);
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `gofmt ${renderOutputPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
