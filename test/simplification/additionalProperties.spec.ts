/* eslint-disable no-undef */
import { CommonModel } from '../../src/models';
import {Simplifier} from '../../src/simplification/Simplifier';
import simplifyAdditionalProperties from '../../src/simplification/SimplifyAdditionalProperties';
jest.mock('../../src/simplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplifyRecursive: jest.fn().mockImplementation(() => [new CommonModel()]),
        simplify: jest.fn().mockImplementation(() => [new CommonModel()])
      };
    })
  };
});
describe('Simplification to additionalProperties', () => {
  test('should always return undefined if type is not object', () => {
    const schema = {type: 'string'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'string';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(simplifier.simplify).toHaveBeenCalledTimes(0);
  });
  test('should always return undefined if all types has been defined', () => {
    const schema = {type: ['string', 'object', 'null', 'number', 'array', 'boolean']};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = ['string', 'object', 'null', 'number', 'array', 'boolean'];
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(simplifier.simplify).toHaveBeenCalledTimes(0);
  });
  test('should always return true if type object and nothing is defined', () => {
    const schema = {type: 'object'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({});
    expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(1);
  });
  test('should return true if additionalProperties is true', () => {
    const schema = { type: 'object', additionalProperties: true};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({});
    expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(1);
  });
  test('should return false if additionalProperties is false', () => {
    const schema = { type: 'object', additionalProperties: false};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(0);
  });
  test('should return simplified additionalProperties if schema', () => {
    const schema = { type: 'object', additionalProperties: {type: 'object', properties: {test: {type: 'string'}}}};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({});
    expect(simplifier.simplifyRecursive).toHaveBeenCalledTimes(1);
  });
});