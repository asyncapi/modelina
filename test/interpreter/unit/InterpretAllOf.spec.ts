/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import { isModelObject } from '../../../src/interpreter/Utils';
import interpretAllOf from '../../../src/interpreter/InterpretAllOf';

let interpreterOptions = Interpreter.defaultInterpreterOptions;
let mockedReturnModel: CommonModel | undefined = new CommonModel();
jest.mock('../../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return mockedReturnModel;}),
        interpretAndCombineSchema: jest.fn()
      };
    })
  };
});
jest.mock('../../../src/models/CommonModel');
let mockedIsModelObjectReturn = false;
jest.mock('../../../src/interpreter/Utils', () => {
  return {
    isModelObject: jest.fn().mockImplementation(() => {
      return mockedIsModelObjectReturn;
    })
  };
});
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpretation of allOf', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    interpreterOptions = {allowInheritance: true};
    mockedReturnModel = new CommonModel();
    mockedIsModelObjectReturn = false;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain allOf', () => {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretAllOf({}, model, interpreter);
    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should combine schemas if inheritance is disabled', () => {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    interpreterOptions.allowInheritance = false;
    const interpreter = new Interpreter();
    interpretAllOf(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpret).toHaveBeenNthCalledWith(1, {}, interpreterOptions);
    expect(interpreter.interpretAndCombineSchema).toHaveBeenNthCalledWith(1, schema.allOf[0], model, schema, interpreterOptions);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should ignore model if interpreter cannot interpret schema', () => {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    mockedReturnModel = undefined;
    const interpreter = new Interpreter();
    interpretAllOf(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should handle empty allOf array', () => {
    const model = new CommonModel();
    const schema = { allOf: [] };
    const interpreter = new Interpreter();
    interpretAllOf(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should extend model', () => {
    const model = new CommonModel();
    const schema = { allOf: [{type: 'object', $id: 'test'}] };
    (mockedReturnModel as CommonModel).$id = 'test';
    mockedIsModelObjectReturn = true;
    const interpreter = new Interpreter();
    interpretAllOf(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpretAndCombineSchema).not.toHaveBeenCalled();
    expect(isModelObject).toHaveBeenCalled();
    expect(model.addExtendedModel).toHaveBeenCalledWith(mockedReturnModel);
  });
});
