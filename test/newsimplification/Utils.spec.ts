
import { CommonModel } from '../../src/models/CommonModel';
import { simplifyName, inferTypeFromValue, isModelObject } from '../../src/newsimplification/Utils';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('utils', function () {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  describe('isModelObject', function () {
    test('should return true if model type is object', function () {
      const model = new CommonModel();
      model.type = 'object';
      const isModel = isModelObject(model);
      expect(isModel).toEqual(true);
    });
    test('should return true if model type contains object', function () {
      const model = new CommonModel();
      model.type = ['object', 'string'];
      const isModel = isModelObject(model);
      expect(isModel).toEqual(true);
    });
    test('should return false if contains all types', function () {
      const model = new CommonModel();
      model.type = ['object', 'string', 'number', 'array', 'boolean', 'null', 'integer'];
      const isModel = isModelObject(model);
      expect(isModel).toEqual(false);
    });
    test('should return false if type is not defined', function () {
      const model = new CommonModel();
      const isModel = isModelObject(model);
      expect(isModel).toEqual(false);
    });
  });
  describe('simplifyName', function () {
    test('should return undefined if schema is null', function () {
      const schema = null;
      const simplifiedName = simplifyName(schema);
      expect(simplifiedName).toBeUndefined();
    });
    test('should return undefined if schema is boolean', function () {
      const schema = true;
      const simplifiedName = simplifyName(schema);
      expect(simplifiedName).toBeUndefined();
    });
    test('should return title as name', function () {
      const schema = { title: "test" };
      const simplifiedName = simplifyName(schema);
      expect(simplifiedName).toEqual("test");
    });
    test('should return $id as name', function () {
      const schema = { $id: "test" };
      const simplifiedName = simplifyName(schema);
      expect(simplifiedName).toEqual("test");
    });
    test('should return x-modelgen-inferred-name as name', function () {
      const schema = { "x-modelgen-inferred-name": "test" };
      const simplifiedName = simplifyName(schema);
      expect(simplifiedName).toEqual("test");
    });
  });
  describe('inferTypeFromValue', function () {
    test('should infer string', function () {
      const value = 'string value';
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('string');
    });
    test('should infer integer from bigint value', function () {
      const value = BigInt(0);
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('integer');
    });
    test('should infer null', function () {
      const value = null;
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('null');
    });
    test('should infer array', function () {
      const value: any[] = [];
      const inferredType = inferTypeFromValue(value);
      expect(inferredType).toEqual('array');
    });
  });
});