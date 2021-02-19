import * as fs from 'fs';
import * as path from 'path';
import {simplify} from '../../src/simplification/Simplifier';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification', function() {
  test('should return as is', function() {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/multipleObjects.json'), 'utf8');
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/expected/multipleObjects.json'), 'utf8');
    const schema = JSON.parse(inputSchemaString);
    const expectedModels = JSON.parse(expectedSchemaString);
    const actualModels = simplify(schema);
    expect(actualModels).not.toBeUndefined();
    expect(actualModels[0]).toEqual(expectedModels[0]);
    expect(actualModels[1]).toEqual(expectedModels[1]);
    expect(schema.$id).toBeUndefined();
  });

  test('should support array roots', function() {
    const actualModels = simplify({ "type": "array", "items": [{ "type": "string" }, { "type": "number" }] });
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/expected/array_root.json'), 'utf8');
    const expectedModel = JSON.parse(expectedSchemaString);
    expect(actualModels).not.toBeUndefined();
    expect(actualModels[0]).toEqual(expectedModel);
  });
  test('should support string roots', function() {
    const actualModels = simplify({ "type": "string" });
    expect(actualModels).not.toBeUndefined();
    expect(actualModels[0]).toEqual({
      "originalSchema":{
        "type":"string"
      },
      "type":"string"
    });
  });
});