import * as fs from 'fs';
import * as path from 'path';
import { SimplificationOptions } from '../../src/models/SimplificationOptions';
import Simplifier from '../../src/simplification/Simplifier';
import simplifyProperties from '../../src/simplification/SimplifyProperties';

/**
 * 
 * @param inputSchemaPath 
 * @param expectedPropertiesPath 
 */
const expectFunction = (inputSchemaPath: string, expectedPropertiesPath: string, options?: SimplificationOptions) => {
  const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
  const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedPropertiesPath), 'utf8');
  const inputSchema = JSON.parse(inputSchemaString);
  const expectedProperties = JSON.parse(expectedCommonInputModelString);
  const simplifier = new Simplifier(options);
  const { newModels, properties } = simplifyProperties(inputSchema, simplifier);
  expect(newModels).toBeUndefined();
  expect(properties).toEqual(expectedProperties);
}
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of properties', function () {
  test('should return as is', function () {
    const inputSchemaPath = './properties/basic.json';
    const expectedPropertiesPath = './properties/expected/basic.json';
    expectFunction(inputSchemaPath, expectedPropertiesPath);
  });
  
  describe('if inheritance turned off allOf schemas should be merged', function () {
    test('when simple schema', function () {
      const inputSchemaPath = './properties/allOf.json';
      const expectedPropertiesPath = './properties/expected/allOf.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
    });
    test('when nested schema', function () {
      const inputSchemaPath = './properties/allOfNested.json';
      const expectedPropertiesPath = './properties/expected/allOfNested.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
    });
  });
  describe('from anyOf schemas', function () {
    test('with simple schema', function () {
      const inputSchemaPath = './properties/anyOf.json';
      const expectedPropertiesPath = './properties/expected/anyOf.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
    test('with nested schema', function () {
      const inputSchemaPath = './properties/anyOfNested.json';
      const expectedPropertiesPath = './properties/expected/anyOfNested.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
  });
  describe('from oneOf schemas', function () {
    test('with simple schema', function () {
      const inputSchemaPath = './properties/oneOf.json';
      const expectedPropertiesPath = './properties/expected/oneOf.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
    test('with nested oneOf schemas', function () {
      const inputSchemaPath = './properties/oneOfNested.json';
      const expectedPropertiesPath = './properties/expected/oneOfNested.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
  });
  describe('from if/then/else schemas', function () {
    test('with simple schema', function () {
      const inputSchemaPath = './properties/conditional.json';
      const expectedPropertiesPath = './properties/expected/conditional.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
    test('with nested schema', function () {
      const inputSchemaPath = './properties/conditionalNested.json';
      const expectedPropertiesPath = './properties/expected/conditionalNested.json';
      expectFunction(inputSchemaPath, expectedPropertiesPath);
    });
  });
  test('Should merge properties which same key', function () {
    const inputSchemaPath = './properties/combine_properties.json';
    const expectedPropertiesPath = './properties/expected/combine_properties.json';
    expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
  });
  test('Should split out multiple objects into their own models and add reference', function () {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './properties/multiple_objects.json'), 'utf8');
    const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './properties/expected/multiple_objects.json'), 'utf8');
    const inputSchema = JSON.parse(inputSchemaString);
    const expectedProperties = JSON.parse(expectedCommonInputModelString);
    const simplifier = new Simplifier();
    const { newModels, properties } = simplifyProperties(inputSchema, simplifier);
    expect(newModels).toHaveLength(1);
    expect(newModels).toEqual(expectedProperties.newModels);
    expect(properties).toEqual(expectedProperties.properties);
  });
});
