/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable no-undef */

import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { SimplificationOptions } from '../../src/models/SimplificationOptions';
import { Simplifier } from '../../src/simplification/Simplifier';
import simplifyPatternProperties from '../../src/simplification/SimplifyPatternProperties';
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
  const patternProperties = simplifyPatternProperties(inputSchema, simplifier);
  expect(patternProperties).toEqual(expectedProperties);
  return simplifier;
};

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense, but they are used to test the principles.
 */
describe('Simplification of patternProperties', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should return as is', () => {
    const inputSchemaPath = './patternProperties/basic.json';
    const expectedPropertiesPath = './patternProperties/expected/basic.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
  });
  
  describe('if inheritance turned off allOf schemas should be merged', () => {
    test('when simple schema', () => {
      const inputSchemaPath = './patternProperties/allOf.json';
      const expectedPropertiesPath = './patternProperties/expected/allOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('when nested schema', () => {
      const inputSchemaPath = './patternProperties/allOfNested.json';
      const expectedPropertiesPath = './patternProperties/expected/allOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath, {allowInheritance: false});
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from anyOf schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './patternProperties/anyOf.json';
      const expectedPropertiesPath = './patternProperties/expected/anyOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('with nested schema', () => {
      const inputSchemaPath = './patternProperties/anyOfNested.json';
      const expectedPropertiesPath = './patternProperties/expected/anyOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from oneOf schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './patternProperties/oneOf.json';
      const expectedPropertiesPath = './patternProperties/expected/oneOf.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    });
    test('with nested oneOf schemas', () => {
      const inputSchemaPath = './patternProperties/oneOfNested.json';
      const expectedPropertiesPath = './patternProperties/expected/oneOfNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
  });
  describe('from if/then/else schemas', () => {
    test('with simple schema', () => {
      const inputSchemaPath = './patternProperties/conditional.json';
      const expectedPropertiesPath = './patternProperties/expected/conditional.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(3);
    });
    test('with nested schema', () => {
      const inputSchemaPath = './patternProperties/conditionalNested.json';
      const expectedPropertiesPath = './patternProperties/expected/conditionalNested.json';
      const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
      expect(simplifier.simplify).toHaveBeenCalledTimes(5);
    });
  });
  test('Should merge patternProperties which same key', () => {
    const inputSchemaPath = './patternProperties/combinePatternProperties.json';
    const mockMergeCommonModels = jest.fn().mockReturnValue(new CommonModel());
    CommonModel.mergeCommonModels = mockMergeCommonModels;
    const expectedPropertiesPath = './patternProperties/expected/combinePatternProperties.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
    expect(mockMergeCommonModels).toHaveBeenCalledTimes(1);
  });
  test('Should split out multiple objects into their own models and add reference', () => {
    const inputSchemaPath = './patternProperties/multipleObjects.json';
    const expectedPropertiesPath = './patternProperties/expected/multipleObjects.json';
    const simplifier = expectFunction(inputSchemaPath, expectedPropertiesPath);
    expect(simplifier.simplify).toHaveBeenCalledTimes(2);
  });
  test('should return already seen schemas', () => {
    const alreadySeen = new Map<any, Record<string, CommonModel>>();
    const schema = {$id: 'test'};
    const model = new CommonModel();
    model.$id = 'test2';
    alreadySeen.set(schema, {testProp: model});
    const simplifier = new Simplifier();
    const output = simplifyPatternProperties(schema, simplifier, alreadySeen);
    expect(output).toEqual({testProp: model});
  });
});
