/* eslint-disable no-undef */
import { CommonModel } from '../../../src/models/CommonModel';
import { Interpreter } from '../../../src/interpreter/Interpreter';
import interpretProperties from '../../../src/interpreter/InterpretProperties';
import { AsyncapiV2Schema } from '../../../src';
jest.mock('../../../src/interpreter/Interpreter');
jest.mock('../../../src/models/CommonModel');
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpretation of properties', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('should not do anything if schema does not contain properties', () => {
    const schema = {};
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretProperties(schema, model, interpreter);

    expect(JSON.stringify(model)).toEqual(JSON.stringify(new CommonModel()));
  });
  test('should ignore model if interpreter cannot interpret property schema', () => {
    const schema: any = { properties: { property1: { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    (interpreter.interpret as jest.Mock).mockReturnValue(undefined);

    interpretProperties(schema, model, interpreter);

    expect(model.addProperty).not.toHaveBeenCalled();
  });
  test('should infer type of model', () => {
    const schema: any = { properties: { property1: { type: 'string' } } };
    const model = new CommonModel();
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretProperties(schema, model, interpreter);

    expect(model.addTypes).toHaveBeenNthCalledWith(1, 'object');
  });
  test('should go trough properties and add it to model', () => {
    const schema: any = { properties: { property1: { type: 'string' } } };
    const model = new CommonModel();
    model.required = ['property1'];
    const interpreter = new Interpreter();
    const mockedReturnModel = new CommonModel();
    (interpreter.interpret as jest.Mock).mockReturnValue(mockedReturnModel);

    interpretProperties(schema, model, interpreter);

    expect(interpreter.interpret).toHaveBeenNthCalledWith(
      1,
      { type: 'string' },
      Interpreter.defaultInterpreterOptions
    );
    expect(model.addProperty).toHaveBeenNthCalledWith(
      1,
      'property1',
      mockedReturnModel,
      schema
    );
    expect(mockedReturnModel.propertyIsRequired).toBe(true);
  });

  test('should set discriminator when discriminator is set in interpreterOptions', () => {
    const property = AsyncapiV2Schema.toSchema({
      type: 'string'
    });
    const schema = AsyncapiV2Schema.toSchema({
      type: 'object',
      properties: {
        discriminatorProperty: property
      }
    });
    const model = new CommonModel();
    const interpreter = new Interpreter();

    interpretProperties(schema, model, interpreter, {
      discriminator: 'discriminatorProperty'
    });

    expect(model.discriminator).toBe('discriminatorProperty');
    expect(interpreter.interpret).toHaveBeenCalledWith(property, {
      discriminator: 'discriminatorProperty'
    });
  });
});
