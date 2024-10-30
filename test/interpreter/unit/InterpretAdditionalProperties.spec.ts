/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretAdditionalProperties from '../../../src/interpreter/InterpretAdditionalProperties';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
describe('Interpretation of additionalProperties', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should try and interpret additionalProperties schema', () => {
    const schema: any = { additionalProperties: { type: 'string' } };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      { type: 'string' },
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
  test('should try and interpret additionalProperties schema if no type', () => {
    const schema: any = { additionalProperties: { type: 'string' } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      { type: 'string' },
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
  test('should ignore model if interpreter cannot interpret additionalProperty schema', () => {
    const schema: any = {};
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(model.addAdditionalProperty).not.toHaveBeenCalled();
  });
  test('should be able to define additionalProperties as false', () => {
    const schema: any = { additionalProperties: false };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      false,
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addAdditionalProperty).not.toHaveBeenCalled();
  });
  test('should only work if model is object type', () => {
    const schema: any = {};
    const model = new CommonModel();
    model.type = 'string';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addAdditionalProperty).not.toHaveBeenCalled();
  });
  test('should default to true', () => {
    const schema: any = {};
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      true,
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
  test('should apply ignoreAdditionalProperties for schemas with properties', () => {
    const schema: any = { properties: { property1: { type: 'string' } } };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    const options = { ignoreAdditionalProperties: true };
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter, options);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, false, options);
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
  test('should not apply ignoreAdditionalProperties for schemas explicit additionalProperties', () => {
    const schema: any = { additionalProperties: true };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    const options = { ignoreAdditionalProperties: true };
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter, options);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, true, options);
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
  test('should not apply ignoreAdditionalProperties if no other properties defined', () => {
    const schema: any = {};
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    const options = { ignoreAdditionalProperties: true };
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretAdditionalProperties(schema, model, interpreter, options);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, true, options);
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(
      1,
      mockedReturnModel,
      schema
    );
  });
});
