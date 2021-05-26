import { CommonModel } from '../../src/models/CommonModel';
import { Interpreter } from '../../src/interpreter/Interpreter';
import interpretNot from '../../src/interpreter/InterpretNot';
import {inferTypeFromValue} from '../../src/interpreter/Utils';
import { Logger } from '../../src/utils';
import { Schema } from '../../src/models';
jest.mock('../../src/interpreter/Utils');
jest.mock('../../src/utils');
let interpreterOptions = Interpreter.defaultInterpreterOptions;
let interpretedReturnModels = [new CommonModel()];
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return interpretedReturnModels;})
      };
    })
  };
});
describe('Interpretation of not', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (inferTypeFromValue as jest.Mock).mockImplementation(() => {return;});
    interpretedReturnModels = [new CommonModel()];
    interpreterOptions = Interpreter.defaultInterpreterOptions;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if not is not defined', () => {
    const schema: Schema = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should ignore model if interpreter cannot interpret not schema', () => {
    const schema: Schema = { not: { } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretedReturnModels.pop();
    interpretNot(schema, model, interpreter, interpreterOptions);
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should warn about true schemas', () => {
    const schema: Schema = { not: true};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
    expect(Logger.warn).toHaveBeenCalled();
  });
  describe('double negate', () => {
    test('should double negate enum', () => {
      const schema: Schema = { not: { enum: ['value'], not: { enum: ['value'] } }};
      const notModel = new CommonModel();
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.enum = ['value'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.enum).toEqual(['value']);
    });

    test('should double negate types', () => {
      const schema: Schema = { not: { type: 'string', not: { type: 'string' }}};
      const notModel = new CommonModel();
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.type = 'string';
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.type).toEqual('string');
    });
  });
  describe('enums', () => {
    test('should remove already existing inferred enums', () => {
      const schema: Schema = { not: { enum: ['value'] }};
      const notModel = new CommonModel();
      notModel.enum = (schema.not as Schema).enum;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.enum = ['value'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.enum).toBeUndefined();
    });
    test('should handle negating only existing enum', () => {
      const schema: Schema = { not: { enum: ['value'] }};
      const notModel = new CommonModel();
      notModel.enum = (schema.not as Schema).enum;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.enum = ['value', 'value2'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.enum).toEqual(['value2']);
    });
    test('should not negating non existing enum', () => {
      const schema: Schema = { not: { enum: ['value'] }};
      const notModel = new CommonModel();
      notModel.enum = (schema.not as Schema).enum;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.enum = ['value2'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.enum).toEqual(['value2']);
    });
    test('should handle multiple negated enums', () => {
      const schema: Schema = { not: { enum: ['value', 'value2'] }};
      const notModel = new CommonModel();
      notModel.enum = (schema.not as Schema).enum;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.enum = ['value', 'value2', 'value3'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.enum).toEqual(['value3']);
    });
  });
  describe('types', () => {
    test('should handle negating only existing type', () => {
      const schema: Schema = { not: { type: 'string' }};
      const notModel = new CommonModel();
      notModel.type = (schema.not as Schema).type;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.type = 'string';
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.type).toBeUndefined();
    });
    test('should remove already existing inferred type', () => {
      const schema: Schema = { not: { type: 'string' }};
      const notModel = new CommonModel();
      notModel.type = (schema.not as Schema).type;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.type = ['string', 'number'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.type).toEqual('number');
    });
    test('should not negating non existing type', () => {
      const schema: Schema = { not: { type: 'string' }};
      const notModel = new CommonModel();
      notModel.type = (schema.not as Schema).type;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.type = 'number';
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.type).toEqual('number');
    });
    test('should handle multiple negated types', () => {
      const schema: Schema = { not: { type: ['string', 'number'] }};
      const notModel = new CommonModel();
      notModel.type = (schema.not as Schema).type;
      interpretedReturnModels = [notModel];
      const model = new CommonModel();
      model.type = ['number', 'string', 'integer'];
      const interpreter = new Interpreter();
      interpretNot(schema, model, interpreter, interpreterOptions);
      const expectedInterpreterOptions = {...interpreterOptions, splitModels: false, allowInheritance: false};
      expect(interpreter.interpret).toHaveBeenNthCalledWith(1, schema.not, expectedInterpreterOptions);
      expect(model.type).toEqual('integer');
    });
  });
});
