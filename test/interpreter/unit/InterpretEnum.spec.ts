import { CommonModel } from '../../../src/models/CommonModel';
import interpretEnum from '../../../src/interpreter/InterpretEnum';
import { inferTypeFromValue } from '../../../src/interpreter/Utils';
jest.mock('../../../src/interpreter/Utils');
jest.mock('../../../src/models/CommonModel');

describe('Interpretation of enum', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should not infer type if schema have type', () => {
    const model = new CommonModel();
    const schema: any = { type: 'string', enum: ['test'] };
    interpretEnum(schema, model);
    expect(model.addTypes).not.toHaveBeenCalled();
    expect(model.addEnum).toHaveBeenNthCalledWith(1, schema.enum[0]);
  });
  test('Should not add enum if it already exist', () => {
    const model = new CommonModel();
    model.enum = ['test'];
    const schema: any = { enum: ['test'] };
    interpretEnum(schema, model);
    expect(model.addEnum).toHaveBeenNthCalledWith(1, schema.enum[0]);
  });
  test('should not do anything if schema does not contain enum', () => {
    const model = new CommonModel();
    interpretEnum({}, model);
    expect(model.addTypes).not.toHaveBeenCalled();
    expect(model.addEnum).not.toHaveBeenCalled();
  });
  test('should not infer type from unknown value type', () => {
    (inferTypeFromValue as jest.Mock).mockReturnValue(undefined);
    const schema: any = { enum: ['test'] };
    const model = new CommonModel();
    interpretEnum(schema, model);
    expect(model.addEnum).toHaveBeenNthCalledWith(1, schema.enum[0]);
    expect(model.setType).not.toHaveBeenCalled();
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
  test('should add inferred value', () => {
    (inferTypeFromValue as jest.Mock).mockReturnValue('string');
    const schema: any = { enum: ['test'] };
    const model = new CommonModel();
    interpretEnum(schema, model);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
    expect(model.addTypes).toHaveBeenNthCalledWith(1, 'string');
    expect(model.addEnum).toHaveBeenNthCalledWith(1, schema.enum[0]);
  });
});
