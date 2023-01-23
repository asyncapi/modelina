import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretNot from '../../../src/interpreter/InterpretNot';
import { inferTypeFromValue } from '../../../src/interpreter/Utils';
import { Logger } from '../../../src/utils';
let interpreterOptions = Interpreter.defaultInterpreterOptions;
jest.mock('../../../src/interpreter/Utils');
jest.mock('../../../src/utils');
jest.mock('../../../src/interpreter/Interpreter');
describe('Interpretation of not', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (inferTypeFromValue as jest.Mock).mockImplementation(() => {
      return;
    });
    interpreterOptions = Interpreter.defaultInterpreterOptions;
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if not is not defined', () => {
    const schema: any = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    interpretNot(schema, model, interpreter, interpreterOptions);
    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });

  test('should ignore model if interpreter cannot interpret not schema', () => {
    const schema: any = { not: {} };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretNot(schema, model, interpreter, interpreterOptions);

    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should warn about true schemas', () => {
    const schema: any = { not: true };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretNot(schema, model, interpreter, interpreterOptions);

    expect(interpreter.interpret).not.toHaveBeenCalled();
    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
    expect(Logger.warn).toHaveBeenCalled();
  });
  describe('double negate', () => {
    test('should double negate enum', () => {
      const schema: any = {
        not: { enum: ['value'], not: { enum: ['value'] } }
      };
      const model = new CommonModel();
      model.enum = ['value'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.enum).toEqual(['value']);
    });

    test('should double negate types', () => {
      const schema: any = { not: { type: 'string', not: { type: 'string' } } };
      const model = new CommonModel();
      model.type = 'string';
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.type).toEqual('string');
    });
  });
  describe('enums', () => {
    test('should remove already existing inferred enums', () => {
      const schema: any = { not: { enum: ['value'] } };
      const model = new CommonModel();
      model.enum = ['value'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.enum = schema.not.enum;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.enum).toBeUndefined();
    });
    test('should handle negating only existing enum', () => {
      const schema: any = { not: { enum: ['value'] } };
      const model = new CommonModel();
      model.enum = ['value', 'value2'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.enum = schema.not.enum;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.enum).toEqual(['value2']);
    });
    test('should not negating non existing enum', () => {
      const schema: any = { not: { enum: ['value'] } };
      const model = new CommonModel();
      model.enum = ['value2'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.enum = schema.not.enum;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.enum).toEqual(['value2']);
    });
    test('should handle multiple negated enums', () => {
      const schema: any = { not: { enum: ['value', 'value2'] } };
      const model = new CommonModel();
      model.enum = ['value', 'value2', 'value3'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.enum = schema.not.enum;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.enum).toEqual(['value3']);
    });
  });
  describe('types', () => {
    test('should handle negating only existing type', () => {
      const schema: any = { not: { type: 'string' } };
      const model = new CommonModel();
      model.type = 'string';
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.type = schema.not.type;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.type).toBeUndefined();
    });
    test('should remove already existing inferred type', () => {
      const schema: any = { not: { type: 'string' } };
      const model = new CommonModel();
      model.type = ['string', 'number'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.type = schema.not.type;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.type).toEqual('number');
    });
    test('should not negating non existing type', () => {
      const schema: any = { not: { type: 'string' } };
      const model = new CommonModel();
      model.type = 'number';
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.type = schema.not.type;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.type).toEqual('number');
    });
    test('should handle multiple negated types', () => {
      const schema: any = { not: { type: ['string', 'number'] } };
      const model = new CommonModel();
      model.type = ['number', 'string', 'integer'];
      const interpreter = new Interpreter();
      const mockedReturnModel = new CommonModel();
      mockedReturnModel.type = schema.not.type;
      (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

      interpretNot(schema, model, interpreter, interpreterOptions);

      const expectedInterpreterOptions = {
        ...interpreterOptions,
        allowInheritance: false
      };
      expect(interpreter.interpret).toHaveBeenNthCalledWith(
        1,
        schema.not,
        expectedInterpreterOptions
      );
      expect(model.type).toEqual('integer');
    });
  });
});
