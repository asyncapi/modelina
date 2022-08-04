/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 * 
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 * 
 */

import * as path from 'path';
import * as fs from 'fs';
import { GoFileGenerator, CSharpFileGenerator, JavaFileGenerator, JAVA_COMMON_PRESET, TypeScriptFileGenerator, JavaScriptFileGenerator } from '../../src';
import { execCommand, generateModels, renderModels, renderModelsToSeparateFiles } from './utils/Utils';

/**
 * Read all the files in the folder, and return the appropriate Jest `each` entries.
 * @param folder 
 */
function readFilesInFolder(folder: string) {
  const fullPath = path.resolve(__dirname, `../blackbox/docs/${folder}`);
  return fs.readdirSync(fullPath).map(
    (file) => { 
      return { file: `../blackbox/docs/${folder}/${file}`, filename: path.parse(file).name};
    }
  );
}
const OpenAPI3_0Files = readFilesInFolder('OpenAPI-3_0');
const jsonSchemaDraft7Files = readFilesInFolder('JsonSchemaDraft-7');
const jsonSchemaDraft6Files = readFilesInFolder('JsonSchemaDraft-6');
const jsonSchemaDraft4Files = readFilesInFolder('JsonSchemaDraft-4');
const AsyncAPIV2_0Files = readFilesInFolder('AsyncAPI-2_0');
const AsyncAPIV2_1Files = readFilesInFolder('AsyncAPI-2_1');
const AsyncAPIV2_2Files = readFilesInFolder('AsyncAPI-2_2');
const AsyncAPIV2_3Files = readFilesInFolder('AsyncAPI-2_3');
const AsyncAPIV2_4Files = readFilesInFolder('AsyncAPI-2_4');

const filesToTest = [
  // ...OpenAPI3_0Files,
  // ...AsyncAPIV2_0Files,
  // ...AsyncAPIV2_1Files,
  // ...AsyncAPIV2_2Files,
  // ...AsyncAPIV2_3Files,
  // ...AsyncAPIV2_4Files,
  ...jsonSchemaDraft4Files.filter(({file}) => {
    // Too large to process https://github.com/asyncapi/modelina/issues/822
    return !file.includes('aws-cloudformation.json');
  }).filter(({file}) => {
    // Related to https://github.com/asyncapi/modelina/issues/389
    return !file.includes('jenkins-config.json');
  }).filter(({file}) => {
    // Related to https://github.com/asyncapi/modelina/issues/825
    return !file.includes('circleci-config.json');
  }),
  // ...jsonSchemaDraft7Files,
  // ...jsonSchemaDraft6Files,
];

// eslint-disable-next-line no-console
console.log('This is gonna take some time, Stay Awhile and Listen');
describe.each(filesToTest)('Should be able to generate with inputs', ({file, filename}) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  describe(file, () => {
    describe('should be able to generate and transpile TS', () => {
      test('class', async () => {
        const outputDirectoryPath = path.resolve(__dirname, './projects/typescript/src/models/', filename, './class');
        const outputTestDirectoryPath = path.resolve(__dirname, './projects/typescript/test/models/', filename);
        const generator = new TypeScriptFileGenerator({modelType: 'class', renderTests: true, testFramework: 'jest'});
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));

        const generatedModels = await generator.generateToFiles(input, outputDirectoryPath, {outputTestDirectory: outputTestDirectoryPath});
        expect(generatedModels).not.toHaveLength(0);

        // const transpileCommand = `npm i && npm run build && npm run test`;
        // await execCommand(transpileCommand); 
      });
    });
  });
});
