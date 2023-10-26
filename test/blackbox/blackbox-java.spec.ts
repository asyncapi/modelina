/**
 * Blackbox tests are the final line of defense, that takes different real-life example documents and generate their corresponding models in all supported languages.
 *
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 *
 */

import * as path from 'path';
import * as fs from 'fs';
import {
  InputMetaModel,
  InputProcessor,
  JavaFileGenerator,
  JAVA_COMMON_PRESET
} from '../../src';
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
      'java'
    );
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
      const javaGeneratorOptions = [
        {
          generatorOption: {},
          description: 'default generator',
          renderOutputPath: path.resolve(outputDirectoryPath, './class/default')
        },
        {
          generatorOption: {
            presets: [JAVA_COMMON_PRESET]
          },
          description: 'all common presets',
          renderOutputPath: path.resolve(
            outputDirectoryPath,
            './class/commonpreset'
          )
        }
      ];
      describe.each(javaGeneratorOptions)(
        'should be able to generate and compile Java',
        ({ generatorOption, renderOutputPath, description }) => {
          test(`class and enums ${description}`, async () => {
            const generator = new JavaFileGenerator(generatorOption);
            const dependencyPath = path.resolve(
              __dirname,
              './dependencies/java/*'
            );

            const generatedModels = await generator.generateToFiles(
              models,
              renderOutputPath,
              { packageName: 'TestPackageName' }
            );
            expect(generatedModels).not.toHaveLength(0);

            const compileCommand = `javac  -cp ${dependencyPath} ${path.resolve(
              renderOutputPath,
              '*.java'
            )}`;
            await execCommand(compileCommand);
          });
        }
      );
    });
  }
);
