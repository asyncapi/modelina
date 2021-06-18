/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretAdditionalItems from '../../../src/interpreter/InterpretAdditionalItems';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
describe('Interpretation of additionalItems', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should try and interpret additionalItems schema', () => {
    const schema: any = { additionalItems: { type: 'string' } };
    const model = new CommonModel();
    model.type = 'array';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalItems(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' }, Interpreter.defaultInterpreterOptions);
    expect(model.addAdditionalItems).toHaveBeenNthCalledWith(1, mockedReturnModel, schema);
  });
  test('should ignore model if interpreter cannot interpret additionalItems schema', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'array';
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretAdditionalItems(schema, model, interpreter);

    expect(model.addAdditionalItems).not.toHaveBeenCalled();
  });
  test('should be able to define additionalItems as false', () => {
    const schema: any = { additionalItems: false };
    const model = new CommonModel();
    model.type = 'array';
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretAdditionalItems(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, false, Interpreter.defaultInterpreterOptions);
    expect(model.addAdditionalItems).not.toHaveBeenCalled();
  });
  test('should only work if model is array type', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'string';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalItems(schema, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addAdditionalItems).not.toHaveBeenCalled();
  });
  test('should default to true', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'array';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalItems(schema, model, interpreter);
    
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, true, Interpreter.defaultInterpreterOptions);
    expect(model.addAdditionalItems).toHaveBeenNthCalledWith(1, mockedReturnModel, schema);
  });
});
