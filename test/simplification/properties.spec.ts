/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-undef */

import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { SimplificationOptions } from '../../src/models/SimplificationOptions';
import { Simplifier } from '../../src/simplification/Simplifier';
import simplifyProperties from '../../src/simplification/SimplifyProperties';
jest.mock('../../src/simplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()]),
        options: {}
      };
    })
  };
});

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
  const properties = simplifyProperties(inputSchema, simplifier);
  expect(properties).toEqual(expectedProperties);
  return simplifier;
};

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of properties', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should return as is', () => {
    const inputSchemaPath = './properties/basic.json';
    const expectedPropertiesPath = './properties/expected/basic.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
  });
  
  describe('if inheritance turned off allOf schemas should be merged', () => {
    test('when simple schema', () => {
      const inputSchemaPath = './properties/allOf.json';
      const expectedPropertiesPath = './properties/expected/allOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('when nested schema', () => {
      const inputSchemaPath = './properties/allOfNested.json';
      const expectedPropertiesPath = './properties/expected/allOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from anyOf schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './properties/anyOf.json';
      const expectedPropertiesPath = './properties/expected/anyOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('with nested schema', () => {
      const inputSchemaPath = './properties/anyOfNested.json';
      const expectedPropertiesPath = './properties/expected/anyOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from oneOf schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './properties/oneOf.json';
      const expectedPropertiesPath = './properties/expected/oneOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('with nested oneOf schemas', () => {
      const inputSchemaPath = './properties/oneOfNested.json';
      const expectedPropertiesPath = './properties/expected/oneOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from if/then/else schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './properties/conditional.json';
      const expectedPropertiesPath = './properties/expected/conditional.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
    test('with nested schema', () => {
      const inputSchemaPath = './properties/conditionalNested.json';
      const expectedPropertiesPath = './properties/expected/conditionalNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(5);
    });
  });
  test('Should merge properties which same key', () => {
    const inputSchemaPath = './properties/combine_properties.json';
    const mockMergeCommonModels = jest.fn().mockReturnValue(new CommonModel());
    CommonModel.mergeCommonModels = mockMergeCommonModels;
    const expectedPropertiesPath = './properties/expected/combine_properties.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    expect(mockMergeCommonModels).toHaveBeenCalledTimes(1);
  });
  test('Should split out multiple objects into their own models and add reference', () => {
    const inputSchemaPath = './properties/multiple_objects.json';
    const expectedPropertiesPath = './properties/expected/multiple_objects.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
  });
});
