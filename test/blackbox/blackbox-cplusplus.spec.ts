/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 *
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 *
 */
import * as path from 'path';
import * as fs from 'fs';
import {
  CplusplusFileGenerator,
  InputMetaModel,
  InputProcessor
} from '../../src';
import { execCommand } from './utils/Utils';
import filesToTest from './BlackBoxTestFiles';

describe.each(filesToTest)(
  'Should be able to generate with inputs',
  ({ file, outputDirectory }) => {
    jest.setTimeout(1000000);
    const fileToGenerateFor = path.resolve(__dirname, file);
    const outputDirectoryPath = path.resolve(__dirname, outputDirectory, 'cpp');
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
      test('should be able to generate and compile C++ models', async () => {
        const generator = new CplusplusFileGenerator();
        const renderOutputPath = path.resolve(outputDirectoryPath, './class');

        const generatedModels = await generator.generateToFiles(
          models,
          renderOutputPath,
          { namespace: 'TestNamespace' }
        );
        expect(generatedModels).not.toHaveLength(0);

        const transpileCommand = `cd ${renderOutputPath} && g++ -std=c++17 *.hpp -c`;
        await execCommand(transpileCommand);
      });
    });
  }
);
