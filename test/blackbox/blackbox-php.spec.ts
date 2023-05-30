/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 *
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 *
 */

import * as path from 'path';
import * as fs from 'fs';
import {
  InputMetaModel,
  InputProcessor,
  OutputModel,
  PHP_DEFAULT_PRESET,
  PhpFileGenerator
} from '../../src';
import { execCommand } from './utils/Utils';
import filesToTest from './BlackBoxTestFiles';

describe.each(filesToTest)(
  'Should be able to generate with inputs',
  ({ file, outputDirectory }) => {
    jest.setTimeout(1000000);
    const fileToGenerateFor = path.resolve(__dirname, file);
    const outputDirectoryPath = path.resolve(__dirname, outputDirectory, 'php');
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
      const phpGeneratorOptions = [
        {
          generatorOption: {},
          description: 'default generator',
          renderOutputPath: path.resolve(outputDirectoryPath, './class/default')
        },
        {
          generatorOption: {
            presets: [PHP_DEFAULT_PRESET]
          },
          description: 'all common presets',
          renderOutputPath: path.resolve(
            outputDirectoryPath,
            './class/commonpreset'
          )
        }
      ];
      describe.each(phpGeneratorOptions)(
        'should be able to generate and compile PHP',
        ({ generatorOption, renderOutputPath }) => {
          test('class and enums', async () => {
            const generator: PhpFileGenerator = new PhpFileGenerator(
              generatorOption
            );
            const generatedModels: OutputModel[] =
              await generator.generateToFiles(models, renderOutputPath, {
                namespace: 'TestNamespace',
                declareStrictTypes: true
              });
            expect(generatedModels).not.toHaveLength(0);

            const files: string[] = fs.readdirSync(renderOutputPath);

            for (const file of files) {
              const filePath = path.resolve(renderOutputPath, file);
              await execCommand(`php -l ${filePath}`);
            }
          });
        }
      );
    });
  }
);
