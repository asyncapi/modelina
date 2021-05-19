/* eslint-disable no-undef */
import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import { isModelObject } from '../../src/interpreter/Utils';
import interpretAllOf from '../../src/interpreter/InterpretAllOf';
import { SimplificationOptions } from '../../src/models/SimplificationOptions';

let interpreterOptions: SimplificationOptions = {};
let interpretedModel = new CommonModel();
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return [interpretedModel]}),
        combineSchemas: jest.fn(),
        options: interpreterOptions
      };
    })
  };
});
jest.mock('../../src/models/CommonModel');
let mockedIsModelObjectReturn = false;
jest.mock('../../src/interpreter/Utils', () => {
  return {
    isModelObject: jest.fn().mockImplementation(() => {
      return mockedIsModelObjectReturn;
    })
  }
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
    interpretedModel = new CommonModel();
    mockedIsModelObjectReturn = false;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain allOf', function() {
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretAllOf({}, model, interpreter);
    expect(interpreter.combineSchemas).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should combine schemas if inheritance is disabled', function() {
    const model = new CommonModel();
    const schema = { allOf: [{}] };
    interpreterOptions.allowInheritance = false;
    const interpreter = new Interpreter(interpreterOptions);
    interpretAllOf(schema, model, interpreter);
    expect(interpreter.combineSchemas).toHaveBeenNthCalledWith(1, schema.allOf[0], model, schema);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should handle empty allOf array', function() {
    const model = new CommonModel();
    const schema = { allOf: [] };
    const interpreter = new Interpreter(interpreterOptions);
    interpretAllOf(schema, model, interpreter);
    expect(interpreter.combineSchemas).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should extend all of model object', function() {
    const model = new CommonModel();
    const schema = { allOf: [{type: "object", $id: "test"}] };
    interpretedModel.$id = "test";
    mockedIsModelObjectReturn = true;
    const interpreter = new Interpreter(interpreterOptions);
    interpretAllOf(schema, model, interpreter);
    expect(interpreter.combineSchemas).not.toHaveBeenCalled();
    expect(model.extend).toEqual(['test']);
  });
});