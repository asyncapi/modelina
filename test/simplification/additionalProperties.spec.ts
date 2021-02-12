/* eslint-disable no-undef */
import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { Simplifier} from '../../src/simplification/Simplifier';
import simplifyAdditionalProperties from '../../src/simplification/SimplifyAdditionalProperties';

let mockModule = null;
jest.mock('../../src/simplification/Simplifier', () => {
  mockModule = {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplifyRecursive: jest.fn(),
        simplify: jest.fn()
      };
    }),
    isModelObject: jest.fn()
  };
  return mockModule;
});
describe('Simplification to additionalProperties', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockModule.Simplifier.mockClear();
    mockModule.isModelObject.mockClear();
  });
  test('should always return undefined if type is not object', () => {
    const schema = {type: 'string'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'string';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(0);
  });
  test('should always return undefined if all types has been defined', () => {
    const schema = {type: ['string', 'object', 'null', 'number', 'array', 'boolean']};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = ['string', 'object', 'null', 'number', 'array', 'boolean'];
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(0);
  });
  test('should always return true if type object and nothing is defined', () => {
    const schema = {type: 'object'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({
      originalSchema: true,
      type: [
        'object',
        'string',
        'number',
        'array',
        'boolean',
        'null',
      ],
    });
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(0);
  });
  test('should return true if additionalProperties is true', () => {
    const schema = { type: 'object', additionalProperties: true};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({
      originalSchema: true,
      type: [
        'object',
        'string',
        'number',
        'array',
        'boolean',
        'null',
      ],
    });
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(0);
  });
  test('should return false if additionalProperties is false', () => {
    const schema = { type: 'object', additionalProperties: false};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(0);
  });
  test('should return simplified additionalProperties if schema', () => {
    const schema = { type: 'object', additionalProperties: {type: 'object', properties: {test: {type: 'string'}}}};
    const filename = path.resolve(__dirname, './additionalProperties/expected/simple.json');
    const expectedSchemaString = fs.readFileSync(filename, 'utf8');
    const expectedAdditionalProperties = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties).toEqual(expectedAdditionalProperties);
    expect(mockModule.Simplifier).toHaveBeenCalledTimes(1);
  });
});