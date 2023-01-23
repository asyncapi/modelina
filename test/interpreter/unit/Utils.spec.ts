import { CommonModel } from '../../../src/models/CommonModel';
import {
  interpretName,
  inferTypeFromValue,
  isModelObject,
  isEnum
} from '../../../src/interpreter/Utils';

describe('utils', () => {
  describe('isEnum', () => {
    test('should return true if model has enum', () => {
      const model = new CommonModel();
      model.enum = [];
      const isModel = isEnum(model);
      expect(isModel).toEqual(true);
    });
    test('should return false if model does not have', () => {
      const model = new CommonModel();
      const isModel = isEnum(model);
      expect(isModel).toEqual(false);
    });
  });
  describe('isModelObject', () => {
    test('should return true if model type is object', () => {
      const model = new CommonModel();
      model.type = 'object';
      const isModel = isModelObject(model);
      expect(isModel).toEqual(true);
    });
    test('should return true if model type contains object', () => {
      const model = new CommonModel();
      model.type = ['object', 'string'];
      const isModel = isModelObject(model);
      expect(isModel).toEqual(true);
    });
    test('should return false if contains all types', () => {
      const model = new CommonModel();
      model.type = [
        'object',
        'string',
        'number',
        'array',
        'boolean',
        'null',
        'integer'
      ];
      const isModel = isModelObject(model);
      expect(isModel).toEqual(false);
    });
    test('should return false if type is not defined', () => {
      const model = new CommonModel();
      const isModel = isModelObject(model);
      expect(isModel).toEqual(false);
    });
  });
  describe('interpretName', () => {
    test('should return undefined if schema is null', () => {
      const schema = null;
      const interpretedName = interpretName(schema);
      expect(interpretedName).toBeUndefined();
    });
    test('should return undefined if schema is boolean', () => {
      const schema = true;
      const interpretedName = interpretName(schema);
      expect(interpretedName).toBeUndefined();
    });
    test('should return title as name', () => {
      const schema = { title: 'test' };
      const interpretedName = interpretName(schema);
      expect(interpretedName).toEqual('test');
    });
    test('should return $id as name', () => {
      const schema = { $id: 'test' };
      const interpretedName = interpretName(schema);
      expect(interpretedName).toEqual('test');
    });
    test('should return x-modelgen-inferred-name as name', () => {
      const schema = { 'x-modelgen-inferred-name': 'test' };
      const interpretedName = interpretName(schema);
      expect(interpretedName).toEqual('test');
    });
  });
  describe('inferTypeFromValue', () => {
    test('should infer string', () => {
      const value = 'string value';
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('string');
    });
    test('should infer integer from bigint value', () => {
      const value = BigInt(0);
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('integer');
    });
    test('should infer null', () => {
      const value = null;
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('null');
    });
    test('should infer array', () => {
      const value: any[] = [];
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('array');
    });
  });
});
