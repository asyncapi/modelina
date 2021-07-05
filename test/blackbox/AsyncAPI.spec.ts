import * as fs from 'fs';
import * as path from 'path';
import { TypeScriptGenerator, JavaGenerator, JavaScriptGenerator, GoGenerator } from '../../src';
describe('AsyncAPI JSON Schema file', () => {
  describe.each([
    ['TypeScript', new TypeScriptGenerator()],
    ['Java', new JavaGenerator()],
    ['Javascript', new JavaScriptGenerator()],
    ['Go', new GoGenerator()],
  ])('code generated in %s', (_, generator) => {
    test('should not be empty', async () => {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './docs/AsyncAPI_2_0_0.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const generatedContent = await generator.generate(inputSchema);
      expect(generatedContent).not.toBeUndefined();
      expect(generatedContent.length).toBeGreaterThan(1);
    });
  });
});
