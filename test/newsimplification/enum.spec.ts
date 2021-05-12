
import { CommonModel } from '../../src/models/CommonModel';
import simplifyEnums from '../../src/newsimplification/SimplifyEnums';
import {inferTypeFromValue} from '../../src/newsimplification/Utils';
jest.mock('../../src/newsimplification/Utils');
jest.mock('../../src/models/CommonModel');
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification', function() {
  beforeEach(() => {
    jest.clearAllMocks();
    (inferTypeFromValue as jest.Mock).mockImplementation(()=>{});
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should not do anything if schema have type', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string', enum: ['test']};
    simplifyEnums(schema, model);
    expect(model.type).toBeUndefined();
  });
  test('should not do anything if schema does not contain enum', function() {
    const model = new CommonModel();
    simplifyEnums({}, model);
  });
  test('should not do anything if schema is boolean', function() {
    const model = new CommonModel();
    simplifyEnums(true, model);
  });
  test('should add inferred value to existing types', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue('string');
    const schema: any = { enum: ['test']};
    const model = new CommonModel();
    simplifyEnums(schema, model);
    expect(model.addToTypes).toHaveBeenCalledTimes(1);
  });
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