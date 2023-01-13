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
  KOTLIN_DEFAULT_PRESET,
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

describe.each(filesToTest)('Should be able to generate with inputs', ({ file, outputDirectory }) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  const outputDirectoryPath = path.resolve(__dirname, outputDirectory, 'kotlin');

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
          presets: [
            KOTLIN_DEFAULT_PRESET
          ]
        },
        description: 'all common presets',
        renderOutputPath: path.resolve(outputDirectoryPath, './class/commonpreset')
      }
    ];

    describe.each(kotlinGeneratorOptions)('should be able to generate and compile Kotlin', ({ generatorOption, renderOutputPath }) => {
      test('class and enums', async () => {
        const generator = new KotlinFileGenerator(generatorOption);

        const generatedModels = await generator.generateToFiles(models, renderOutputPath, { packageName: 'main'});
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `kotlinc ${path.resolve(renderOutputPath, '*.kt')} -d ${outputDirectoryPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
