import { CommonModel } from '../../../src/models/CommonModel';
import interpretConst from '../../../src/interpreter/InterpretConst';
import { inferTypeFromValue } from '../../../src/interpreter/Utils';
import { AsyncapiV2Schema } from '../../../src';
jest.mock('../../../src/interpreter/Utils');
jest.mock('../../../src/models/CommonModel');
describe('Interpretation of const', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should not do anything if schema does not contain const', () => {
    const model = new CommonModel();
    const schema: any = { type: 'string' };
    interpretConst(schema, model);
    expect(model.setType).not.toHaveBeenCalled();
    expect(model.enum).toBeUndefined();
  });
  test('should not infer type from const if schema have type', () => {
    const model = new CommonModel();
    const schema = AsyncapiV2Schema.toSchema({ type: 'string', const: 'test' });
    interpretConst(schema, model, { discriminator: 'test' });
    expect(model.setType).not.toHaveBeenCalled();
    expect(model.enum).toEqual([schema.const]);
  });
  test('should infer type and enum', () => {
    (inferTypeFromValue as jest.Mock).mockReturnValue('string');
    const schema = AsyncapiV2Schema.toSchema({ const: 'test' });
    const model = new CommonModel();
    interpretConst(schema, model, { discriminator: 'test' });
    expect(model.enum).toEqual([schema.const]);
    expect(model.const).toEqual(schema.const);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
    expect(model.setType).toHaveBeenNthCalledWith(1, 'string');
  });
  test('should not infer unknown type', () => {
    (inferTypeFromValue as jest.Mock).mockReturnValue(undefined);
    const schema = AsyncapiV2Schema.toSchema({ const: 'test' });
    const model = new CommonModel();
    interpretConst(schema, model, { discriminator: 'test' });
    expect(model.enum).toEqual([schema.const]);
    expect(model.setType).not.toHaveBeenCalled();
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
});
