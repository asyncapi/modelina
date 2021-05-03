
import { CommonModel } from '../../src/models/CommonModel';
import simplifyConst from '../../src/newsimplification/SimplifyConst';
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
describe('Simplification of const', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should infer type', function() {
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    simplifyConst(schema, model);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
  test('should reflect const as enum', function() {
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    simplifyConst(schema, model);
    expect(model.enum).toEqual(['test']);
  });
});