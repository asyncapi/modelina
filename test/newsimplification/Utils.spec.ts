
import { CommonModel } from '../../src/models/CommonModel';
import {simplifyName, inferTypeFromValue} from '../../src/newsimplification/Utils';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('utils', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  describe('simplifyName', function() {
    test('should return undefined if schema is boolean', function() {
      expect(simplifyName(true)).toBeUndefined();
    });
    test('should return title as name', function() {
      expect(simplifyName({title: "test"})).toEqual("test");
    });
    test('should return $id as name', function() {
      expect(simplifyName({$id: "test"})).toEqual("test");
    });
    test('should return x-modelgen-inferred-name as name', function() {
      expect(simplifyName({"x-modelgen-inferred-name": "test"})).toEqual("test");
    });
  });
  describe('inferTypeFromValue', function() {
    test('should infer string', function() {
      expect(inferTypeFromValue('string value')).toEqual('string');
    });
    test('should infer integer from bigint value ', function() {
      expect(inferTypeFromValue(BigInt(0))).toEqual('integer');
    });
    test('should infer null ', function() {
      expect(inferTypeFromValue(null)).toEqual('null');
    });
    test('should infer array', function() {
      expect(inferTypeFromValue([])).toEqual('array');
    });
  });
});