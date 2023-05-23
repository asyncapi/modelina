/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import { isModelObject } from '../../../src/interpreter/Utils';
import InterpretOneOf from '../../../src/interpreter/InterpretOneOf';
import { AsyncapiV2Schema } from '../../../src/models';
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
  describe('discriminator', () => {
    test('should set discriminator when discriminator is set in schema', () => {
      const item1 = AsyncapiV2Schema.toSchema({
        type: 'object',
        $id: 'test'
      });
      const schema = AsyncapiV2Schema.toSchema({
        discriminator: 'test',
        oneOf: [item1]
      });
      const model = new CommonModel();
      const interpreter = new Interpreter();
      (interpreter.discriminatorProperty as jest.Mock).mockReturnValue(
        schema.discriminator
      );

      InterpretOneOf(schema, model, interpreter, {});

      expect(model.discriminator).toBe(schema.discriminator);
      expect(interpreter.discriminatorProperty).toHaveBeenCalledWith(schema);
      expect(interpreter.interpret).toHaveBeenCalledWith(item1, {
        discriminator: schema.discriminator
      });
    });

    test('should set discriminator when discriminator is set in one of the oneOf models', () => {
      const item1 = AsyncapiV2Schema.toSchema({
        discriminator: 'test',
        type: 'object',
        $id: 'test'
      });
      const schema = AsyncapiV2Schema.toSchema({
        oneOf: [item1]
      });
      const model = new CommonModel();
      const interpreter = new Interpreter();
      const interpretedModel = new CommonModel();
      interpretedModel.discriminator = item1.discriminator;
      (interpreter.interpret as jest.Mock).mockReturnValue(interpretedModel);

      InterpretOneOf(schema, model, interpreter, {});

      expect(model.discriminator).toBe(item1.discriminator);
      expect(interpreter.interpret).toHaveBeenCalledWith(item1, {});
    });
  });
});
