/**
 * Blackbox tests are the final line of defense, that takes different real-life example documents and generate their corresponding models in all supported languages.
 *
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 *
 */

import * as path from 'path';
import * as fs from 'fs';
import { CSharpFileGenerator, InputMetaModel } from '../../src';
import { execCommand } from './utils/Utils';
import filesToTest from './BlackBoxTestFiles';
describe.each(filesToTest)(
  'Should be able to generate with inputs',
  ({ file, outputDirectory }) => {
    jest.setTimeout(1000000);
    const fileToGenerateFor = path.resolve(__dirname, file);
    const outputDirectoryPath = path.resolve(
      __dirname,
      outputDirectory,
      'csharp'
    );
    let models: InputMetaModel;
    beforeAll(async () => {
      if (fs.existsSync(outputDirectoryPath)) {
        fs.rmSync(outputDirectoryPath, { recursive: true });
      }
      const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
      const generator = new CSharpFileGenerator();
      const input = JSON.parse(String(inputFileContent));
      models = await generator.process(input);
    });
    describe(file, () => {
      describe('should be able to generate and compile C#', () => {
        test('class and enums', async () => {
          const generator = new CSharpFileGenerator();

          const generatedModels = await generator.generateToFiles(
            models,
            outputDirectoryPath,
            { namespace: 'TestNamespace' }
          );
          expect(generatedModels).not.toHaveLength(0);

          const compileCommand = `csc /target:library /out:${path.resolve(
            outputDirectoryPath,
            './compiled.dll'
          )} ${path.resolve(outputDirectoryPath, '*.cs')}`;
          await execCommand(compileCommand);
        });
      });
    });
  }
);
