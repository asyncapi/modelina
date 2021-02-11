import * as fs from 'fs';
import * as path from 'path';
import { JsonSchemaInputProcessor } from '../../src/processors/JsonSchemaInputProcessor';
describe('Simplification', function() {
    test('should return as is', async function() {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPI/AsyncAPI.json'), 'utf8');
      const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPI/expected/AsyncAPI.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const expectedCommonInputModel = JSON.parse(expectedSchemaString);
      const processor = new JsonSchemaInputProcessor();
      const commonInputModel = await processor.process(inputSchema);
      expect(commonInputModel).toEqual(expectedCommonInputModel);
    });
});