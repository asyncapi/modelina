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
  KotlinFileGenerator,
  KOTLIN_CONSTRAINTS_PRESET
} from '../../src';
import { execCommand } from './utils/Utils';
import filesToTest from './BlackBoxTestFiles';

async function generate(fileToGenerateFor: string): Promise<InputMetaModel> {
  const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
  const processor = new InputProcessor();
  const input = JSON.parse(String(inputFileContent));
  return processor.process(input);
}

function deleteDirectoryIfExists(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true });
  }
}

const isWindows = process.platform === 'win32';
const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

// Windows environment has a weird setup, where it is using Kotlin Native instead of Kotlin JVM as it's compiler
// (See https://github.com/asyncapi/modelina/issues/1080)
describeIf(!isWindows).each(filesToTest)(
  'Should be able to generate with inputs',
  ({ file, outputDirectory }) => {
    jest.setTimeout(1000000);
    const fileToGenerateFor = path.resolve(__dirname, file);
    const outputDirectoryPath = path.resolve(
      __dirname,
      outputDirectory,
      'kotlin'
    );

    let models: InputMetaModel;
    beforeAll(async () => {
      deleteDirectoryIfExists(outputDirectoryPath);
      models = await generate(fileToGenerateFor);
    });

    describe(file, () => {
      const kotlinGeneratorOptions = [
        {
          generatorOption: {},
          description: 'default generator',
          renderOutputPath: path.resolve(outputDirectoryPath, './class/default')
        },
        {
          generatorOption: {
            presets: [KOTLIN_CONSTRAINTS_PRESET]
          },
          description: 'constraints preset',
          renderOutputPath: path.resolve(
            outputDirectoryPath,
            './class/constraints'
          )
        }
      ];

      describe.each(kotlinGeneratorOptions)(
        'should be able to generate and compile Kotlin',
        ({ generatorOption, renderOutputPath }) => {
          test('class and enums', async () => {
            const generator = new KotlinFileGenerator(generatorOption);
            const dependencyPath = path.resolve(
              __dirname,
              './dependencies/kotlin/*'
            );

            const generatedModels = await generator.generateToFiles(
              models,
              renderOutputPath,
              { packageName: 'main' }
            );
            expect(generatedModels).not.toHaveLength(0);

            const compileCommand = `kotlinc ${path.resolve(
              renderOutputPath,
              '*.kt'
            )} -cp ${dependencyPath} -d ${renderOutputPath}`;
            await execCommand(compileCommand);
          });
        }
      );
    });
  }
);
