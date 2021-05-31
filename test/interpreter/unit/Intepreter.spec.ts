import {Interpreter} from '../../../src/interpreter/Interpreter';
import {isModelObject, interpretName} from '../../../src/interpreter/Utils';
import interpretProperties from '../../../src/interpreter/InterpretProperties';
import interpretConst from '../../../src/interpreter/InterpretConst';
import interpretEnum from '../../../src/interpreter/InterpretEnum';
import interpretAllOf from '../../../src/interpreter/InterpretAllOf';
import interpretItems from '../../../src/interpreter/InterpretItems';
import interpretAdditionalProperties from '../../../src/interpreter/InterpretAdditionalProperties';
import interpretNot from '../../../src/interpreter/InterpretNot';
import { CommonModel, Schema } from '../../../src/models';

let mockedIsModelObjectReturn = false;
jest.mock('../../../src/interpreter/Utils', () => {
  return {
    interpretName: jest.fn(),
    isModelObject: jest.fn().mockImplementation(() => {
      return mockedIsModelObjectReturn;
    })
  };
});
jest.mock('../../../src/interpreter/InterpretProperties');
jest.mock('../../../src/interpreter/InterpretConst');
jest.mock('../../../src/interpreter/InterpretEnum');
jest.mock('../../../src/interpreter/InterpretAllOf');
jest.mock('../../../src/interpreter/InterpretItems');
jest.mock('../../../src/interpreter/InterpretAdditionalProperties');
jest.mock('../../../src/interpreter/InterpretNot');
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpreter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedIsModelObjectReturn = false;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should return empty models if false schema', () => {
    const schema = false;
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(0);
  });
  test('should inherit types from schema', () => {
    const schema = {
      type: ['string', 'number']
    };
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(models[0].type).toEqual(['string', 'number']);
  });
  test('should inherit type from schema', () => {
    const schema = {
      type: 'string'
    };
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(models[0].type).toEqual('string');
  });
  test('should return model with all types if true schema', () => {
    const schema = true;
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(models[0].type).toEqual(['object', 'string', 'number', 'array', 'boolean', 'null', 'integer']);
  });
  test('should set id of model if object', () => {
    const schema = { type: 'object' };
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(interpretName).toHaveBeenNthCalledWith(1, schema);
    expect(models[0].$id).toEqual('anonymSchema1');
  });
  test('should set custom id of model if object', () => {
    const schema = { $id: 'test' };
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(interpretName).toHaveBeenNthCalledWith(1, schema);
  });
  test('should set required list of properties', () => {
    const schema = { required: ['test'] };
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
    expect(models[0].required).toEqual(schema.required);
  });
  test('should split models', () => {
    const schema = { 
      $id: 'root',
      properties: { }
    };
    mockedIsModelObjectReturn = true;
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema);
    expect(models).toHaveLength(1);
  });

  test('should support recursive schemas', () => {
    const schema1: Schema = { };
    const schema2 = { anyOf: [schema1] };
    schema1.anyOf = [schema2];
    const interpreter = new Interpreter();
    const models = interpreter.interpret(schema1);
    expect(models).toHaveLength(1);
    expect(models[0]).toEqual({originalSchema: schema1});
  });
  describe('combineSchemas', () => {
    test('should combine single schema with model', () => {
      const schema = { required: ['test'] };
      const interpreter = new Interpreter();
      const model = new CommonModel();
      const expectedSimplifiedModel = new CommonModel();
      expectedSimplifiedModel.required = ['test'];
      expectedSimplifiedModel.originalSchema = schema;
      interpreter.combineSchemas(schema, model, schema);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, model, expectedSimplifiedModel, schema);
    });
    test('should combine multiple schema with model', () => {
      const schema = { required: ['test'] };
      const interpreter = new Interpreter();
      const model = new CommonModel();
      const expectedSimplifiedModel = new CommonModel();
      expectedSimplifiedModel.required = ['test'];
      expectedSimplifiedModel.originalSchema = schema;
      interpreter.combineSchemas([schema], model, schema);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, model, expectedSimplifiedModel, schema);
    });
  });
  describe('ensureModelsAreSplit', () => {
    test('should split models if properties contains model object', () => {
      mockedIsModelObjectReturn = true;
      const propertyModel = new CommonModel();
      propertyModel.type = 'object';
      propertyModel.$id = 'test';
      const model = new CommonModel();
      model.properties = {
        test: propertyModel
      };
      const interpreter = new Interpreter();
      interpreter.ensureModelsAreSplit(model);
      expect(isModelObject).toHaveBeenNthCalledWith(1, propertyModel);
      expect(model.properties.test.$ref).toEqual('test');
    });
    test('should not split models if it is not considered model object', () => {
      mockedIsModelObjectReturn = false;
      const propertyModel = new CommonModel();
      propertyModel.type = 'object';
      propertyModel.$id = 'test';
      const model = new CommonModel();
      model.properties = {
        test: propertyModel
      };
      const interpreter = new Interpreter();
      interpreter.ensureModelsAreSplit(model);
      expect(isModelObject).toHaveBeenNthCalledWith(1, propertyModel);
      expect(model.properties.test).toEqual(propertyModel);
    });
  });

  test('should always try to interpret properties', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretProperties).toHaveBeenNthCalledWith(1, schema, expect.anything(), interpreter, Interpreter.defaultInterpreterOptions);
  });

  test('should always try to interpret const', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretConst).toHaveBeenNthCalledWith(1, schema, expect.anything());
  });
  test('should always try to interpret enum', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretEnum).toHaveBeenNthCalledWith(1, schema, expect.anything());
  });
  test('should always try to interpret allOf', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretAllOf).toHaveBeenNthCalledWith(1, schema, expect.anything(), expect.anything(), Interpreter.defaultInterpreterOptions);
  });
  test('should always try to interpret items', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretItems).toHaveBeenNthCalledWith(1, schema, expect.anything(), interpreter, Interpreter.defaultInterpreterOptions);
  });
  test('should always try to interpret additionalProperties', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretAdditionalProperties).toHaveBeenNthCalledWith(1, schema, expect.anything(), interpreter, Interpreter.defaultInterpreterOptions);
  });
  test('should always try to interpret not', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretNot).toHaveBeenNthCalledWith(1, schema, expect.anything(), interpreter, Interpreter.defaultInterpreterOptions);
  });

  test('should support primitive roots', () => {
    const schema = { type: 'string' };
    const interpreter = new Interpreter();
    const actualModels = interpreter.interpret(schema);
    expect(actualModels).not.toBeUndefined();
    expect(actualModels[0]).toEqual({
      originalSchema: {
        type: 'string'
      },
      type: 'string'
    });
  });
});
