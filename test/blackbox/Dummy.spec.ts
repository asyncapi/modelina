import * as path from 'path';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator, GoGenerator } from '../../src';
import { execCommand, generateModels, renderModels } from './utils/Utils';
import { renderJavaModelsToSeparateFiles } from './utils/Utils';
const fileToGenerate = path.resolve(__dirname, './docs/dummy.json');
describe('Dummy JSON Schema file', () => {
  jest.setTimeout(100000);
  describe('should be able to generate and compile Java', () => {
    test('class', async () => {
      const generator = new JavaGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/java/class');
      const dependencyPath = path.resolve(__dirname, './dependencies/java/*');
      await renderJavaModelsToSeparateFiles(generatedModels, renderOutputPath);
      const compileCommand = `javac  -cp ${dependencyPath} ${path.resolve(renderOutputPath, '*.java')}`;
      await execCommand(compileCommand);
    });
  });

  describe('should be able to generate and transpile TS', () => {
    test('class', async () => {
      const generator = new TypeScriptGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/ts/class/output.ts');
      await renderModels(generatedModels, renderOutputPath);
      const transpiledOutputPath = path.resolve(__dirname, './output/ts/class/output.js');
      const transpileAndRunCommand = `tsc -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
      await execCommand(transpileAndRunCommand);
    });

    test('interface', async () => {
      const generator = new TypeScriptGenerator({modelType: 'interface'});
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/ts/interface/output.ts');
      await renderModels(generatedModels, renderOutputPath);
      const transpiledOutputPath = path.resolve(__dirname, './output/ts/interface/output.js');
      const transpileAndRunCommand = `tsc -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
      await execCommand(transpileAndRunCommand);
    });
  });

  describe('should be able to generate JS', () => {
    test('class', async () => {
      const generator = new JavaScriptGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/js/class/output.js');
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
      const renderOutputPath = path.resolve(__dirname, './output/go/struct/main.go');
      await renderModels(generatedModels, renderOutputPath, ['package main\n', 'func main() {}']);
      const compileCommand = `go build -o ${renderOutputPath.replace('.go', '')} ${renderOutputPath}`;
      await execCommand(compileCommand);
    });
  });
});
