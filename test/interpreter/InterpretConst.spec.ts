
import { CommonModel } from '../../src/models/CommonModel';
import interpretConst from '../../src/interpreter/InterpretConst';
import {inferTypeFromValue} from '../../src/interpreter/Utils';
jest.mock('../../src/interpreter/Utils');
describe('Simplification of const', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should not do anything for boolean schemas', function() {
    const model = new CommonModel();
    const schema: any = true;
    interpretConst(schema, model);
    expect(model.type).toBeUndefined();
  });
  test('should not do anything if schema does not contain const', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string'};
    interpretConst(schema, model);
    expect(model.type).toBeUndefined();
  });
  test('should not infer type from const if schema have type', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string', const: 'test'};
    interpretConst(schema, model);
    expect(model.type).toBeUndefined();
  });
  test('should infer type and enum', function() {
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    interpretConst(schema, model);
    expect(model.enum).toEqual([schema.const]);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
  test('should infer const as enum', function() {
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    interpretConst(schema, model);
    expect(model.enum).toEqual(['test']);
  });
  test('should overwrite existing type', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue("string");
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    model.type = "array";
    interpretConst(schema, model);
    expect(model.type).toEqual("string");
  });
});