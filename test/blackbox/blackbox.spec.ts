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
  const fullPath = path.resolve(__dirname, `./docs/${folder}`);
  return fs.readdirSync(fullPath).map(
    (file) => { 
      return { file: `./docs/${folder}/${file}`, outputDirectory: `./output/${folder}/${path.parse(file).name}`};
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
    // Related to https://github.com/asyncapi/modelina/issues/825
    return !file.includes('circleci-config.json');
  }),
  // ...jsonSchemaDraft7Files,
  // ...jsonSchemaDraft6Files,
];

// eslint-disable-next-line no-console
console.log('This is gonna take some time, Stay Awhile and Listen');
describe.each(filesToTest)('Should be able to generate with inputs', ({file, outputDirectory}) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  const outputDirectoryPath = path.resolve(__dirname, outputDirectory);
  beforeAll(async () => {
    if (fs.existsSync(outputDirectoryPath)) {
      await fs.rmSync(outputDirectoryPath, {recursive: true});
    }
  });
  describe(file, () => {
    const javaGeneratorOptions = [
      { 
        generatorOption: { },
        description: 'default generator',
        renderOutputPath: path.resolve(outputDirectoryPath, './java/class/default')
      },
      { 
        generatorOption: {
          presets: [
            JAVA_COMMON_PRESET
          ]
        },
        description: 'all common presets',
        renderOutputPath: path.resolve(outputDirectoryPath, './java/class/commonpreset')
      }
    ]; 
    describe.each(javaGeneratorOptions)('should be able to generate and compile Java', ({generatorOption, description, renderOutputPath}) => {
      test('class', async () => {
        const generator = new JavaFileGenerator(generatorOption);
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const dependencyPath = path.resolve(__dirname, './dependencies/java/*');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath, {packageName: 'TestPackageName'});
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `javac  -cp ${dependencyPath} ${path.resolve(renderOutputPath, '*.java')}`;
        await execCommand(compileCommand);
      });
    });
    describe('should be able to generate and compile C#', () => {
      test('class', async () => {
        const generator = new CSharpFileGenerator();
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './csharp');
        
        const generatedModels = await generator.generateToFiles(input, renderOutputPath, {namespace: 'TestNamespace'});
        expect(generatedModels).not.toHaveLength(0);
        
        const compileCommand = `csc /target:library /out:${path.resolve(renderOutputPath, './compiled.dll')} ${path.resolve(renderOutputPath, '*.cs')}`;
        await execCommand(compileCommand);
      });
    });

    describe('should be able to generate and transpile TS', () => {
      test('class', async () => {
        const generator = new TypeScriptFileGenerator({modelType: 'class'});
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './ts/class');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath);
        expect(generatedModels).not.toHaveLength(0);

        const transpileCommand = `tsc --downlevelIteration -t es5 --baseUrl ${renderOutputPath}`;
        await execCommand(transpileCommand); 
      });

      test('interface', async () => {
        const generator = new TypeScriptFileGenerator({modelType: 'interface'});
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './ts/interface');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath);
        expect(generatedModels).not.toHaveLength(0);

        const transpileCommand = `tsc --downlevelIteration -t es5 --baseUrl ${renderOutputPath}`;
        await execCommand(transpileCommand);
      });
    });

    describe('should be able to generate JS', () => {
      test('class', async () => {
        const generator = new JavaScriptFileGenerator();
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './js/class');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath, {moduleSystem: 'CJS'});
        expect(generatedModels).not.toHaveLength(0);

        const files = fs.readdirSync(renderOutputPath);
        for (const file of files) {
          const transpileAndRunCommand = `node --check ${path.resolve(renderOutputPath, file)}`;
          await execCommand(transpileAndRunCommand); 
        }
      });
    });

    describe('should be able to generate Go', () => {
      test('struct', async () => {
        const generator = new GoFileGenerator();
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './go/struct/');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath, {packageName: 'test_package_name'});
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `gofmt ${renderOutputPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
