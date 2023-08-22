import { Interpreter } from '../../../src/interpreter/Interpreter';
import {
  interpretName,
  isEnum,
  isModelObject
} from '../../../src/interpreter/Utils';
import interpretProperties from '../../../src/interpreter/InterpretProperties';
import interpretConst from '../../../src/interpreter/InterpretConst';
import interpretEnum from '../../../src/interpreter/InterpretEnum';
import interpretAllOf from '../../../src/interpreter/InterpretAllOf';
import interpretItems from '../../../src/interpreter/InterpretItems';
import interpretAdditionalProperties from '../../../src/interpreter/InterpretAdditionalProperties';
import interpretAdditionalItems from '../../../src/interpreter/InterpretAdditionalItems';
import interpretNot from '../../../src/interpreter/InterpretNot';
import interpretDependencies from '../../../src/interpreter/InterpretDependencies';
import InterpretThenElse from '../../../src/interpreter/InterpretThenElse';
import {
  AsyncapiV2Schema,
  CommonModel,
  OpenapiV3Schema,
  SwaggerV2Schema,
  defaultMergingOptions
} from '../../../src/models';
import { Draft7Schema } from '../../../src/models/Draft7Schema';

jest.mock('../../../src/interpreter/Utils');
jest.mock('../../../src/interpreter/InterpretProperties');
jest.mock('../../../src/interpreter/InterpretConst');
jest.mock('../../../src/interpreter/InterpretEnum');
jest.mock('../../../src/interpreter/InterpretAllOf');
jest.mock('../../../src/interpreter/InterpretItems');
jest.mock('../../../src/interpreter/InterpretAdditionalProperties');
jest.mock('../../../src/interpreter/InterpretNot');
jest.mock('../../../src/interpreter/InterpretDependencies');
jest.mock('../../../src/interpreter/InterpretAdditionalItems');
jest.mock('../../../src/interpreter/InterpretThenElse');
CommonModel.mergeCommonModels = jest.fn();
/**
 * Some of these test are purely theoretical and have little if any merit
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Interpreter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  test('should return empty model if false schema', () => {
    const schema = false;
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).toBeUndefined();
  });
  test('should inherit types from schema', () => {
    const schema = {
      type: ['string', 'number']
    };
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(model?.type).toEqual(['string', 'number']);
  });
  test('should inherit type from schema', () => {
    const schema = {
      type: 'string',
      format: 'date-time'
    };
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(model?.type).toEqual('string');
    expect(model?.format).toEqual('date-time');
  });
  test('should return model with all types if true schema', () => {
    const schema = true;
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(model?.type).toEqual([
      'object',
      'string',
      'number',
      'array',
      'boolean',
      'null',
      'integer'
    ]);
  });
  test('should set id of model if enum', () => {
    const schema = { enum: ['value'] };
    const interpreter = new Interpreter();
    (isEnum as jest.Mock).mockReturnValue(true);
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(interpretName).toHaveBeenNthCalledWith(1, schema);
    expect(model?.$id).toEqual('anonymSchema1');
  });
  test('should set id of model if object', () => {
    const schema = { type: 'object' };
    const interpreter = new Interpreter();
    (isModelObject as jest.Mock).mockReturnValue(true);
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(interpretName).toHaveBeenNthCalledWith(1, schema);
    expect(model?.$id).toEqual('anonymSchema1');
  });
  test('should set custom id of model if object', () => {
    const schema = { $id: 'test' };
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(interpretName).toHaveBeenNthCalledWith(1, schema);
  });
  test('should set required list of properties', () => {
    const schema = { required: ['test'] };
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema);
    expect(model).not.toBeUndefined();
    expect(model?.required).toEqual(schema.required);
  });

  test('should support recursive schemas', () => {
    const schema1: Draft7Schema = {};
    const schema2 = { anyOf: [schema1] };
    schema1.anyOf = [schema2];
    const interpreter = new Interpreter();
    const model = interpreter.interpret(schema1);
    expect(model).not.toBeUndefined();
    expect(model).toMatchObject({
      originalInput: schema1,
      $id: 'anonymSchema2'
    });
  });
  describe('combineSchemas', () => {
    test('should combine single schema with model', () => {
      const schema = { required: ['test'] };
      const interpreter = new Interpreter();
      const model = new CommonModel();
      const expectedSimplifiedModel = new CommonModel();
      expectedSimplifiedModel.$id = 'anonymSchema1';
      expectedSimplifiedModel.required = ['test'];
      expectedSimplifiedModel.originalInput = schema;
      interpreter.interpretAndCombineSchema(schema, model, schema);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(
        1,
        model,
        expectedSimplifiedModel,
        schema,
        new Map(),
        defaultMergingOptions
      );
    });
  });
  test('should always try to interpret properties', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretProperties).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      interpreter,
      Interpreter.defaultInterpreterOptions
    );
  });

  test('should always try to interpret const', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretConst).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      expect.anything()
    );
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
    expect(interpretAllOf).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      expect.anything(),
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret items', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretItems).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      interpreter,
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret additionalProperties', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretAdditionalProperties).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      interpreter,
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret not', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretNot).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      interpreter,
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret dependencies', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretDependencies).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      expect.anything(),
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret if/then/else', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(InterpretThenElse).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      expect.anything(),
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should always try to interpret additionalItems', () => {
    const schema = {};
    const interpreter = new Interpreter();
    interpreter.interpret(schema);
    expect(interpretAdditionalItems).toHaveBeenNthCalledWith(
      1,
      schema,
      expect.anything(),
      expect.anything(),
      Interpreter.defaultInterpreterOptions
    );
  });
  test('should support primitive roots', () => {
    const schema = { type: 'string' };
    const interpreter = new Interpreter();
    const actualModel = interpreter.interpret(schema);
    expect(actualModel).not.toBeUndefined();
    expect(actualModel).toEqual({
      originalInput: {
        type: 'string'
      },
      $id: 'anonymSchema1',
      type: 'string'
    });
  });
  describe('discriminatorProperty', () => {
    test('should interpret AsyncapiV2Schema discriminator property', () => {
      const schema = AsyncapiV2Schema.toSchema({
        discriminator: 'AsyncapiV2SchemaDiscriminatorPropertyName',
        type: 'object',
        $id: 'test'
      });
      const interpreter = new Interpreter();
      const discriminator = interpreter.discriminatorProperty(schema);
      expect(discriminator).toBe('AsyncapiV2SchemaDiscriminatorPropertyName');
    });
    test('should interpret SwaggerV2Schema discriminator property', () => {
      const schema = SwaggerV2Schema.toSchema({
        discriminator: 'SwaggerV2SchemaDiscriminatorPropertyName',
        type: 'object',
        $id: 'test'
      });
      const interpreter = new Interpreter();
      const discriminator = interpreter.discriminatorProperty(schema);
      expect(discriminator).toBe('SwaggerV2SchemaDiscriminatorPropertyName');
    });
    test('should interpret OpenapiV3Schema discriminator property', () => {
      const schema = OpenapiV3Schema.toSchema({
        discriminator: {
          propertyName: 'OpenapiV3SchemaDiscriminatorPropertyName'
        },
        type: 'object',
        $id: 'test'
      });
      const interpreter = new Interpreter();
      const discriminator = interpreter.discriminatorProperty(schema);
      expect(discriminator).toBe('OpenapiV3SchemaDiscriminatorPropertyName');
    });
  });
});
