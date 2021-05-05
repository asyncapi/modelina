
import { CommonModel } from '../../src/models/CommonModel';
import simplifyEnums from '../../src/newsimplification/SimplifyEnums';
import {inferTypeFromValue} from '../../src/newsimplification/Utils';
jest.mock('../../src/newsimplification/Utils', () => {
  return {
    inferTypeFromValue: jest.fn()
  };
});
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  describe('of single enum', function() {
    test('should infer type from enum', function() {
      const schema: any = { enum: ['test']};
      const model = new CommonModel();
      simplifyEnums(schema, model);
      expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
    });
    test('Should use defined enums as is', function() {
      const schema: any = { enum: ['test']};
      const model = new CommonModel();
      simplifyEnums(schema, model);
      expect(model.enum).toEqual(['test']);
    });
  });
  describe('of multiple enums', function() {
    test('should infer type from enum', function() {
      const schema: any = { enum: ['test', 2]};
      const model = new CommonModel();
      simplifyEnums(schema, model);
      expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
      expect(inferTypeFromValue).toHaveBeenNthCalledWith(2, 2);
    });
    test('Should use defined enums as is', function() {
      const schema: any = { enum: ['test', 2]};
      const model = new CommonModel();
      simplifyEnums(schema, model);
      expect(model.enum).toEqual(['test', 2]);
    });
  });
});