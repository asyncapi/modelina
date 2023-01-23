/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import { isModelObject } from '../../../src/interpreter/Utils';
import InterpretAnyOf from '../../../src/interpreter/InterpretAnyOf';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
jest.mock('../../../src/interpreter/Utils');
CommonModel.mergeCommonModels = jest.fn();

describe('Interpretation of anyOf', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain anyOf', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    InterpretAnyOf({}, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addItemUnion).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should add anyOf items to CommonModel union', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const schema = { anyOf: [{}, {}] };
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    InterpretAnyOf(schema, model, interpreter, { allowInheritance: false });

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.anyOf[0], {
      allowInheritance: false
    });
    expect(interpreter.interpret).toHaveBeenNthCalledWith(2, schema.anyOf[1], {
      allowInheritance: false
    });
    expect(model.addItemUnion).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
});
