/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import { isModelObject } from '../../../src/interpreter/Utils';
import interpretAllOf from '../../../src/interpreter/InterpretAllOf';
const interpreterOptionsAllowInheritance = {allowInheritance: true};
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
jest.mock('../../../src/interpreter/Utils');
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpretation of allOf', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain allOf', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    interpretAllOf({}, model, interpreter);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should combine schemas if inheritance is disabled', () => {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    interpretAllOf(schema, model, interpreter, {allowInheritance: false});

    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, {}, {allowInheritance: false});
    expect(interpreter.interpretAndCombineSchema).toHaveBeenNthCalledWith(1, schema.allOf[0], model, schema, {allowInheritance: false});
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should ignore model if interpreter cannot interpret schema', () => {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);
    (isModelObject as jest.Mock).mockReturnValue(false);

    interpretAllOf(schema, model, interpreter, interpreterOptionsAllowInheritance);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should handle empty allOf array', () => {
    const model = new CommonModel();
    const schema = { allOf: [] };
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(new CommonModel());
    (isModelObject as jest.Mock).mockReturnValue(false);

    interpretAllOf(schema, model, interpreter, interpreterOptionsAllowInheritance);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should extend model', () => {
    const model = new CommonModel();
    const schema = { allOf: [{type: 'object', $id: 'test'}] };
    const interpreter = new Interpreter();
    const interpretedModel = new CommonModel();
    interpretedModel.$id = 'test';
    (isModelObject as jest.Mock).mockReturnValue(true);
    (interpreter.interpret as jest.Mock).mockReturnValue(interpretedModel);

    interpretAllOf(schema, model, interpreter, interpreterOptionsAllowInheritance);

    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(isModelObject).toHaveBeenCalled();
    expect(model.addExtendedModel).toHaveBeenCalledWith(interpretedModel);
  });
});
