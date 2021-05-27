import {promises as fs} from 'fs';

import * as path from 'path';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator } from '../../src';
import { execCommand, generateModels, renderModels } from './utils/Utils';
import { renderModelsToSeparateFiles } from './utils/Utils';
const fileToGenerate = path.resolve(__dirname, './docs/dummy.json');
describe('Dummy JSON Schema file', function() {
  describe('should be able to generate and compile Java', () => {
    test('class', async function() {
      const generator = new JavaGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/java');
      await renderModelsToSeparateFiles(generatedModels, renderOutputPath);
      const compileCommand = `javac ${path.resolve(renderOutputPath, '*.java')}`
      await execCommand(compileCommand);
    });
  });

  describe('should be able to generate and transpile TS', () => {
    test('class', async function() {
      const generator = new TypeScriptGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/ts/output.ts');
      await renderModels(generatedModels, renderOutputPath);
      const transpiledOutputPath = path.resolve(__dirname, './output/ts/output.js');
      const transpileAndRunCommand = `tsc -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
      await execCommand(transpileAndRunCommand);
    });

    test('interface', async function() {
      const generator = new TypeScriptGenerator({modelType: 'interface'});
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/ts/output.ts');
      await renderModels(generatedModels, renderOutputPath);
      const transpiledOutputPath = path.resolve(__dirname, './output/ts/output.js');
      const transpileAndRunCommand = `tsc -t es5 ${renderOutputPath} && node ${transpiledOutputPath}`;
      await execCommand(transpileAndRunCommand);
    });
  });

  describe('should be able to generate JS', () => {
    test('class', async function() {
      const generator = new JavaScriptGenerator();
      const generatedModels = await generateModels(fileToGenerate, generator);
      expect(generatedModels).not.toHaveLength(0);
      const renderOutputPath = path.resolve(__dirname, './output/js/output.js');
      await renderModels(generatedModels, renderOutputPath);
      const transpileAndRunCommand = `node ${renderOutputPath}`;
      await execCommand(transpileAndRunCommand);
    });
  });
});