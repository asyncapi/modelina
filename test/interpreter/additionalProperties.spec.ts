/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretAdditionalProperties from '../../src/interpreter/InterpretAdditionalProperties';

jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});

describe('Interpretation of additionalProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should use as is', () => {
    const schema: any = { additionalProperties: { type: 'string' } };
    const model = new CommonModel();
    model.type = "object";
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, { type: 'string' });
    expect(model).toMatchObject(
      {
        additionalProperties: { },
      },
    );
  });
  test('should only work if model is object type', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = "string";
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.additionalProperties).toBeUndefined();
  });
  test('should default to true', () => {
    const schema: any = { };
    const model = new CommonModel();
    model.type = "object";
    const interpreter = new Interpreter();
    interpretAdditionalProperties(schema, model, interpreter);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, true);
    expect(model).toMatchObject(
      {
        additionalProperties: { },
      },
    );
  });
});