/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretAdditionalProperties from '../../../src/interpreter/InterpretAdditionalProperties';

let mockedReturnModel: CommonModel | undefined = new CommonModel();
jest.mock('../../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return mockedReturnModel;})
      };
    })
  };
});
jest.mock('../../../src/models/CommonModel');
describe('Interpretation of additionalProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReturnModel = new CommonModel();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should try and interpret additionalProperties schema', () => {
    const schema: any = { additionalProperties: { type: 'string' } };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' }, Interpreter.defaultInterpreterOptions);
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(1, mockedReturnModel, schema);
  });
  test('should ignore model if interpreter cannot interpret additionalProperty schema', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    mockedReturnModel = undefined;
    interpretAdditionalProperties(schema, model, interpreter);
    expect(model.addAdditionalProperty).not.toHaveBeenCalled();
  });
  test('should only work if model is object type', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'string';
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addAdditionalProperty).not.toHaveBeenCalled();
  });
  test('should default to true', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = 'object';
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, true, Interpreter.defaultInterpreterOptions);
    expect(model.addAdditionalProperty).toHaveBeenNthCalledWith(1, mockedReturnModel, schema);
  });
});
