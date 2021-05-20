import { CommonModel } from '../../src/models/CommonModel';
import interpretEnum from '../../src/interpreter/InterpretEnum';
import {inferTypeFromValue} from '../../src/interpreter/Utils';
jest.mock('../../src/interpreter/Utils');
jest.mock('../../src/models/CommonModel');

describe('Interpretation of enum', function() {
  beforeEach(() => {
    jest.clearAllMocks();
  })
  afterAll(() => {
    jest.restoreAllMocks();
  })
  test('should not infer type if schema have type', function() {
    const model = new CommonModel();
    const schema: any = { type: 'string', enum: ['test']};
    interpretEnum(schema, model);
    expect(model.addTypes).not.toHaveBeenCalled();
    expect(model.enum).toEqual(schema.enum);
  });
  test('Should not add enum if it already exist', function() {
    const model = new CommonModel();
    model.enum = ['test']
    const schema: any = {enum: ['test']};
    interpretEnum(schema, model);
    expect(model.enum).toEqual(['test']);
  });
  test('should not do anything if schema does not contain enum', function() {
    const model = new CommonModel();
    interpretEnum({}, model);
    expect(model.addTypes).not.toHaveBeenCalled();
    expect(model.enum).toBeUndefined(); 
  });
  test('should not infer type from unknown value type', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue(undefined);
    const schema: any = { enum: ['test']};
    const model = new CommonModel();
    interpretEnum(schema, model);
    expect(model.enum).toEqual(schema.enum);
    expect(model.setType).not.toHaveBeenCalled();
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
  });
  test('should add inferred value', function() {
    (inferTypeFromValue as jest.Mock).mockReturnValue('string');
    const schema: any = { enum: ['test']};
    const model = new CommonModel();
    interpretEnum(schema, model);
    expect(inferTypeFromValue).toHaveBeenNthCalledWith(1, 'test');
    expect(model.addTypes).toHaveBeenNthCalledWith(1, "string");
  });
});