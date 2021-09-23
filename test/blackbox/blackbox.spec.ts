import * as path from 'path';
import * as fs from 'fs';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator, GoGenerator, CSharpGenerator, TS_COMMON_PRESET } from '../../src';
import { execCommand, generateModels, renderModels, renderModelsToSeparateFiles } from './utils/Utils';
const jsonSchemaPath = path.resolve(__dirname, './docs/JsonSchemaDraft-7');
const jsonSchemaDraft7Files = fs.readdirSync(jsonSchemaPath).map((file) => { return { file: `./docs/JsonSchemaDraft-7/${file}`, outputDirectory: `JsonSchemaDraft-7/${path.parse(file).name}`};});

// const filesToTest = [
//   {file: './docs/AsyncAPI-2_0/dummy.json', outputDirectory: 'AsyncAPI-2_0/dummy'},
//   {file: './docs/AsyncAPI-2_0/zbos_mqtt-all-asyncapi.json', outputDirectory: 'AsyncAPI-2_0/zbos_mqtt-all-asyncapi'},
//   {file: './docs/AsyncAPI-2_1/dummy.json', outputDirectory: 'AsyncAPI-2_1/dummy'},
//   ...jsonSchemaDraft7Files
// ];
const filesToTest = [
  {file: './docs/JsonSchemaDraft-7/graphql-code-generator.json', outputDirectory: 'JsonSchemaDraft-7/graphql-code-generator'}
];
console.log(filesToTest);
describe.each(filesToTest)('Should be able to generate with inputs', ({file, outputDirectory}) => {
  jest.setTimeout(1000000);
  const fileToGenerate = path.resolve(__dirname, file);
  describe(file, () => {
    describe('should be able to generate and compile Java', () => {
      test('class', async () => {
        const generator = new JavaGenerator();
        const generatedModels = await generateModels(fileToGenerate, generator);
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
        const generatedModels = await generateModels(fileToGenerate, generator);
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
        const generatedModels = await generateModels(fileToGenerate, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/class/output.ts`);
        await renderModels(generatedModels, renderOutputPath);
        const transpiledOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/ts/class/output.js`);
        const transpileAndRunCommand = `tsc --downlevelIteration -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
        await execCommand(transpileAndRunCommand);
      });

      test('interface', async () => {
        const generator = new TypeScriptGenerator({modelType: 'interface'});
        const generatedModels = await generateModels(fileToGenerate, generator);
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
        const generatedModels = await generateModels(fileToGenerate, generator);
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
        const generatedModels = await generateModels(fileToGenerate, generator);
        expect(generatedModels).not.toHaveLength(0);
        const renderOutputPath = path.resolve(__dirname, `./output/${outputDirectory}/go/struct/main.go`);
        await renderModels(generatedModels, renderOutputPath, ['package main\n', 'func main() {}']);
        const compileCommand = `go build -o ${renderOutputPath.replace('.go', '')} ${renderOutputPath}`;
        await execCommand(compileCommand);
      });
    });
  });
});
