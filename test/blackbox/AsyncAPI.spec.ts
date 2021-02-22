import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator } from '../../src/';

const generator = new TypeScriptGenerator({ modelType: 'interface' });
describe('AsyncAPI JSON Schema file', function() {
    test('should be generated in TypeScript', async function() {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPI/AsyncAPI_2_0_0.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const generator = new TypeScriptGenerator();
      const generatedContent = await generator.generate(inputSchema);
      expect(generatedContent).not.toBeUndefined();
    });
    test('should be generated in Java', async function() {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPI/AsyncAPI_2_0_0.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const generator = new JavaGenerator();
      const generatedContent = await generator.generate(inputSchema);
      expect(generatedContent).not.toBeUndefined();
    });
    test('should be generated in JavaScript', async function() {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPI/AsyncAPI_2_0_0.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const generator = new JavaScriptGenerator();
      const generatedContent = await generator.generate(inputSchema);
      expect(generatedContent).not.toBeUndefined();
    });
});