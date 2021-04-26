/* eslint-disable no-undef */
import { CommonModel } from '../../src/models';
import {Simplifier} from '../../src/simplification/Simplifier';
import simplifyAdditionalProperties from '../../src/simplification/SimplifyAdditionalProperties';
jest.mock('../../src/simplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});
describe('Simplification to additionalProperties', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should always return undefined if type is not object', () => {
    const schema = {type: 'string'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'string';
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toBeUndefined();
    expect(simplifier.simplify).toHaveBeenCalledTimes(0);
  });
  test('should always return undefined if all types has been defined', () => {
    const schema = {type: ['string', 'object', 'null', 'number', 'array', 'boolean', 'integer']};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = ['string', 'object', 'null', 'number', 'array', 'boolean', 'integer'];
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toBeUndefined();
    expect(simplifier.simplify).toHaveBeenCalledTimes(0);
  });
  test('should always return true if type object and nothing is defined', () => {
    const schema = {type: 'object'};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toEqual({});
    expect(simplifier.simplify).toHaveBeenCalledTimes(1);
  });
  test('should return true if additionalProperties is true', () => {
    const schema = { type: 'object', additionalProperties: true};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toEqual({});
    expect(simplifier.simplify).toHaveBeenCalledTimes(1);
  });
  test('should return false if additionalProperties is false', () => {
    const schema = { type: 'object', additionalProperties: false};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toBeUndefined();
    expect(simplifier.simplify).toHaveBeenCalledTimes(0);
  });
  test('should return simplified additionalProperties if schema', () => {
    const schema = { type: 'object', additionalProperties: {type: 'object', properties: {test: {type: 'string'}}}};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = 'object';
    const additionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(additionalProperties).toEqual({});
    expect(simplifier.simplify).toHaveBeenCalledTimes(1);
  });
});