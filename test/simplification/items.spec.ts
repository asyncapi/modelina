/* eslint-disable no-undef */
import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models/CommonModel';
import { Simplifier } from '../../src/simplification/Simplifier';
import simplifyItems from '../../src/simplification/SimplifyItems';
jest.mock('../../src/simplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplifyRecursive: jest.fn().mockReturnValue([new CommonModel()]),
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});

const mockMergeCommonModels = jest.fn().mockReturnValue(new CommonModel());
CommonModel.mergeCommonModels = mockMergeCommonModels;
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of items', () => {
  beforeEach(() => {
    mockMergeCommonModels.mockClear();
  });
  describe('as is', () => {
    test('should return item', () => {
      const schema: any = { items: { type: 'string' } };
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(1);
    });
  });
  describe('from allOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(2);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(4);
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(3);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(7);
    });
  });

  describe('from oneOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(2);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(4);
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(3);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(7);
    });
  });

  describe('from anyOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(2);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(4);
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(3);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(7);
    });
  });
  describe('from conditional if/then/else ', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(2);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(4);
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({});
      expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(4);
      expect(mockMergeCommonModels).toHaveBeenCalledTimes(10);
    });
  });
  test('Should split out multiple objects into their own models and add reference', () => {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './items/multipleObjects.json'), 'utf8');
    const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './items/expected/multipleObjects.json'), 'utf8');
    const inputSchema = JSON.parse(inputSchemaString);
    const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
    const simplifier = new Simplifier();
    const output = simplifyItems(inputSchema, simplifier);
    expect(output.items).toEqual({});
    expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(1);
    expect(mockMergeCommonModels).toHaveBeenCalledTimes(1);
  });
});