/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import { isModelObject } from '../../../src/interpreter/Utils';
import InterpretOneOf from '../../../src/interpreter/InterpretOneOf';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
jest.mock('../../../src/interpreter/Utils');
CommonModel.mergeCommonModels = jest.fn();

describe('Interpretation of oneOf', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain oneOf', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    InterpretOneOf({}, model, interpreter);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(model.addItemUnion).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should add oneOf items to CommonModel union', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const schema = { oneOf: [{}, {}] };
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    InterpretOneOf(schema, model, interpreter, { allowInheritance: false });

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.oneOf[0], {
      allowInheritance: false
    });
    expect(interpreter.interpret).toHaveBeenNthCalledWith(2, schema.oneOf[1], {
      allowInheritance: false
    });
    expect(model.addItemUnion).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should add merge null oneOf into the rest of the unions', () => {
    const model = new CommonModel();
    model.addItemUnion = jest.fn();
    const schema = { oneOf: [{}, {}] };
    const interpreter = new Interpreter();
    const nullType = new CommonModel();
    nullType.type = 'null';
    (interpreter.interpret as jest.Mock)
      .mockReturnValue(new CommonModel())
      .mockReturnValueOnce(nullType);
    (isModelObject as jest.Mock).mockReturnValue(false);

    InterpretOneOf(schema, model, interpreter, { allowInheritance: false });

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.oneOf[0], {
      allowInheritance: false
    });
    expect(interpreter.interpret).toHaveBeenNthCalledWith(2, schema.oneOf[1], {
      allowInheritance: false
    });
    expect(model.addItemUnion).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
});
