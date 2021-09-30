/**
 * Blackbox tests are the final line of defence, that takes different real-life example documents and generate their corresponding models in all supported languages.
 * 
 * For those languages where it is possible, the models are compiled/transpiled to ensure there are no syntax errors in generated models.
 * 
 */

import * as path from 'path';
import * as fs from 'fs';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator, GoGenerator, CSharpGenerator } from '../../src';
import { execCommand, generateModels, renderModels, renderModelsToSeparateFiles } from './utils/Utils';

/**
 * Read all the files in the folder, and return the appropriate Jest `each` entries.
 * @param folder 
 */
function readFilesInFolder(folder: string) {
  const fullPath = path.resolve(__dirname, `./docs/${folder}`);
  return fs.readdirSync(fullPath).map(
    (file) => { 
      return { file: `./docs/${folder}/${file}`, outputDirectory: `${folder}/${path.parse(file).name}`};
    }
  );
}
const jsonSchemaDraft7Files = readFilesInFolder('JsonSchemaDraft-7');
const AsyncAPIV2_0Files = readFilesInFolder('AsyncAPI-2_0');
const AsyncAPIV2_1Files = readFilesInFolder('AsyncAPI-2_1');
const AsyncAPIV2_2Files = readFilesInFolder('AsyncAPI-2_2');

const filesToTest = [
  ...AsyncAPIV2_0Files,
  ...AsyncAPIV2_1Files,
  ...AsyncAPIV2_2Files,
  ...jsonSchemaDraft7Files.filter(({file}) => { 
    //Blocked by https://github.com/asyncapi/modelina/issues/388
    return file !== './docs/JsonSchemaDraft-7/draft-7-core.json';
  }).filter(({file}) => {
    //Blocked by https://github.com/asyncapi/modelina/issues/390
    return file !== './docs/JsonSchemaDraft-7/graphql-code-generator.json';
  })
];

describe.each(filesToTest)('Should be able to generate with inputs', ({file, outputDirectory}) => {
  jest.setTimeout(1000000);
  const fileToGenerateFor = path.resolve(__dirname, file);
  describe(file, () => {
    describe('should be able to generate and compile Java', () => {
      test('class', async () => {
        const generator = new JavaGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/java/class`);
        const dependencyPath = path.resolve(__dirname, './dependencies/java/*');
        await renderModelsToSeparateFiles(generatedModels, renderOutputPath, 'java');
        const compileCommand = `javac  -cp ${dependencyPath} ${path.resolve(renderOutputPath, '*.java')}`;
        await execCommand(compileCommand);
      });
    });
    describe('should be able to generate and compile C#', () => {
      test('class', async () => {
        const generator = new CSharpGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/csharp`);
        await renderModelsToSeparateFiles(generatedModels, renderOutputPath, 'cs');
        const compileCommand = `csc /target:library /out:${path.resolve(renderOutputPath, './compiled.dll')} ${path.resolve(renderOutputPath, '*.cs')}`;
        await execCommand(compileCommand);
      });
    });

    describe('should be able to generate and transpile TS', () => {
      test('class', async () => {
        const generator = new TypeScriptGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/class/output.ts`);
        await renderModels(generatedModels, renderOutputPath);
        const transpiledOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/class/output.js`);
        const transpileAndRunCommand = `tsc --downlevelIteration -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
        await execCommand(transpileAndRunCommand);
      });

      test('interface', async () => {
        const generator = new TypeScriptGenerator({modelType: 'interface'});
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/interface/output.ts`);
        await renderModels(generatedModels, renderOutputPath);
        const transpiledOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/interface/output.js`);
        const transpileAndRunCommand = `tsc -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
        await execCommand(transpileAndRunCommand);
      });
    });

    describe('should be able to generate JS', () => {
      test('class', async () => {
        const generator = new JavaScriptGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/js/class/output.js`);
        await renderModels(generatedModels, renderOutputPath);
        const transpileAndRunCommand = `node ${renderOutputPath}`;
        await execCommand(transpileAndRunCommand);
      });
    });

    describe('should be able to generate Go', () => {
      test('struct', async () => {
        const generator = new GoGenerator();
        const generatedModels = await generateModels(fileToGenerateFor, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/go/struct/main.go`);
        await renderModels(generatedModels, renderOutputPath, ['package main\n', 'func main() {}']);
        const compileCommand = `go build -o ${renderOutputPath.replace('.go', '')} ${renderOutputPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
