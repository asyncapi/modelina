import * as fs from 'fs';
import * as path from 'path';
import Simplifier from '../../src/simplification/Simplifier';

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
    const simplifier = new Simplifier();
    const actualModels = simplifier.simplify(schema);
    expect(actualModels).toEqual(expectedModels);
    expect(schema.$id).toBeUndefined();
  });
  test('should support simple extend', function() {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/extend.json'), 'utf8');
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/expected/extend.json'), 'utf8');
    const schema = JSON.parse(inputSchemaString);
    const expectedModels = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const actualModels = simplifier.simplify(schema);
    expect(actualModels).toEqual(expectedModels);
    expect(schema.$id).toBeUndefined();
  });
  test('should support advanced extend with nested objects', function() {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/extendMultipleObjects.json'), 'utf8');
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/expected/extendMultipleObjects.json'), 'utf8');
    const schema = JSON.parse(inputSchemaString);
    const expectedModels = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const actualModels = simplifier.simplify(schema);
    expect(actualModels).toEqual(expectedModels);
    expect(schema.$id).toBeUndefined();
  });
  test('should support advanced extend with nested objects', function() {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/extendWithProperties.json'), 'utf8');
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './simplify/expected/extendWithProperties.json'), 'utf8');
    const schema = JSON.parse(inputSchemaString);
    const expectedModels = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const actualModels = simplifier.simplify(schema);
    expect(actualModels).not.toBeUndefined();
    expect(actualModels).toEqual(expectedModels);
    expect(schema.$id).toBeUndefined();
  });
});