/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 * 
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 * 
 */

import * as path from 'path';
import * as fs from 'fs';
import { TypeScriptGenerator, JavaScriptGenerator, GoGenerator, CSharpGenerator, JavaFileGenerator, JAVA_COMMON_PRESET, TypeScriptFileGenerator, JavaScriptFileGenerator } from '../../src';
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

const filesToTest = [
  ...OpenAPI3_0Files.filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/456
    return file !== './docs/OpenAPI-3_0/twilio-1_13.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/452
    return file !== './docs/OpenAPI-3_0/postman-api.json';
  }),
  ...AsyncAPIV2_0Files.filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/504
    return file !== './docs/AsyncAPI-2_0/dummy.json';
  }),
  ...AsyncAPIV2_1Files.filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/504
    return file !== './docs/AsyncAPI-2_1/dummy.json';
  }),
  ...AsyncAPIV2_2Files.filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/504
    return file !== './docs/AsyncAPI-2_2/dummy.json';
  }),
  ...jsonSchemaDraft7Files.filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/388
    return file !== './docs/JsonSchemaDraft-7/draft-7-core.json';
  }).filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/390
    return file !== './docs/JsonSchemaDraft-7/graphql-code-generator.json';
  }),
  ...jsonSchemaDraft4Files.filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/449
    return file !== './docs/JsonSchemaDraft-4/openapi-3.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/389
    return file !== './docs/JsonSchemaDraft-4/jenkins-config.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/450
    return file !== './docs/JsonSchemaDraft-4/circleci-config.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/390
    return file !== './docs/JsonSchemaDraft-4/circleci-config.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/452
    return file !== './docs/JsonSchemaDraft-4/chrome-manifest.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/367
    return file !== './docs/JsonSchemaDraft-4/aws-cloudformation.json';
  }).filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/388
    return file !== './docs/JsonSchemaDraft-4/draft-4-core.json';
  }),
  ...jsonSchemaDraft6Files.filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/453
    return file !== './docs/JsonSchemaDraft-6/fhir-full.json';
  })
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
        description: 'default generator'
      },
      { 
        generatorOption: {
          presets: [
            JAVA_COMMON_PRESET
          ]
        },
        description: 'all common presets'
      }
    ]; 
    describe.each(javaGeneratorOptions)('should be able to generate and compile Java', ({generatorOption, description}) => {
      test('class', async () => {
        const generator = new JavaFileGenerator(generatorOption);
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './java/class');
        const dependencyPath = path.resolve(__dirname, './dependencies/java/*');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath, {packageName: 'TestPackageName'});
        expect(generatedModels).not.toHaveLength(0);

        const compileCommand = `javac  -cp ${dependencyPath} ${path.resolve(renderOutputPath, '*.java')}`;
        await execCommand(compileCommand);
      });
    });
    describe('should be able to generate and compile C#', () => {
      test('class', async () => {
        const generator = new CSharpGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(outputDirectoryPath, './csharp');
        await renderModelsToSeparateFiles(generatedModels, renderOutputPath, 'cs');
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

        const transpileAndRunCommand = `tsc --downlevelIteration -t es5 ${path.resolve(renderOutputPath, '*')}`;
        await execCommand(transpileAndRunCommand);
      });

      test('interface', async () => {
        const generator = new TypeScriptFileGenerator({modelType: 'interface'});
        const inputFileContent = await fs.promises.readFile(fileToGenerateFor);
        const input = JSON.parse(String(inputFileContent));
        const renderOutputPath = path.resolve(outputDirectoryPath, './ts/interface');

        const generatedModels = await generator.generateToFiles(input, renderOutputPath);
        expect(generatedModels).not.toHaveLength(0);

        const transpileAndRunCommand = `tsc --downlevelIteration -t es5 ${path.resolve(renderOutputPath, '*')}`;
        await execCommand(transpileAndRunCommand);
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

        const transpileAndRunCommand = `node --check ${path.resolve(renderOutputPath, '*')}`;
        await execCommand(transpileAndRunCommand);
      });
    });

    describe('should be able to generate Go', () => {
      test('struct', async () => {
        const generator = new GoGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(outputDirectoryPath, './go/struct/main.go');
        await renderModels(generatedModels, renderOutputPath, ['package main\n', 'func main() {}']);
        const compileCommand = `go build -o ${renderOutputPath.replace('.go', '')} ${renderOutputPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
