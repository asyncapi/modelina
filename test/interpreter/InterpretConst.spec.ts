
import { CommonModel } from '../../src/models/CommonModel';
import interpretConst from '../../src/interpreter/InterpretConst';
import {inferTypeFromValue} from '../../src/interpreter/Utils';
jest.mock('../../src/interpreter/Utils');
describe('Interpretation of const', function() {
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
    expect(model.enum).toBeUndefined();
  });
  test('should not do anything if schema does not contain const', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string'};
    interpretConst(schema, model);
    expect(model.type).toBeUndefined();
    expect(model.enum).toBeUndefined();
  });
  test('should not infer type from const if schema have type', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string', const: 'test'};
    interpretConst(schema, model);
    expect(model.type).toBeUndefined();
    expect(model.enum).toEqual([schema.const]);
  });
  test('should infer type and enum', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue("string");
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    interpretConst(schema, model);
    expect(model.enum).toEqual([schema.const]);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
    expect(model.type).toEqual("string");
  });
  test('should not infer unknown type', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue(undefined);
    const schema: any = { const: 'test'};
    const model = new CommonModel();
    interpretConst(schema, model);
    expect(model.enum).toEqual([schema.const]);
    expect(model.type).toBeUndefined();
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
});