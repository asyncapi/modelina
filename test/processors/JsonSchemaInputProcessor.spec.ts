import * as fs from 'fs';
import * as path from 'path';
import { JsonSchemaInputProcessor } from '../../src/processors/JsonSchemaInputProcessor';
import { AnyModel, CommonModel, StringModel } from '../../src/models';
jest.mock('../../src/utils/LoggingInterface');
jest.spyOn(JsonSchemaInputProcessor, 'convertSchemaToCommonModel');
let mockedReturnModels = [new CommonModel()];
const mockedMetaModel = new AnyModel('test', undefined);
jest.mock('../../src/helpers/CommonModelToMetaModel', () => {
  return {
    convertToMetaModel: jest.fn().mockImplementation(() => {
      return mockedMetaModel;
    })
  };
});
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {
          return mockedReturnModels[0];
        })
      };
    })
  };
});
describe('JsonSchemaInputProcessor', () => {
  afterEach(() => {
    jest.clearAllMocks();
    const model = new CommonModel();
    model.$id = 'test';
    mockedReturnModels = [model];
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  const getCommonInput = async (inputSchemaPath: string) => {
    const inputSchemaString = fs.readFileSync(
      path.resolve(__dirname, inputSchemaPath),
      'utf8'
    );
    const inputSchema = JSON.parse(inputSchemaString);
    const processor = new JsonSchemaInputProcessor();
    const inputMetaModel = await processor.process(inputSchema);
    return { inputSchema, inputMetaModel };
  };
  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new JsonSchemaInputProcessor();
      await expect(
        processor.process({
          $schema: 'http://json-schema.org/draft-99/schema#'
        })
      ).rejects.toThrow(
        'Input is not a JSON Schema, so it cannot be processed.'
      );
    });
    test('should process draft 7 schemas', async () => {
      const inputSchemaPath = './JsonSchemaInputProcessor/draft-7.json';
      const { inputMetaModel, inputSchema } =
        await getCommonInput(inputSchemaPath);
      expect(inputMetaModel).toMatchObject({
        models: { test: mockedMetaModel },
        originalInput: inputSchema
      });
      expect(
        JsonSchemaInputProcessor.convertSchemaToCommonModel
      ).toHaveBeenCalledTimes(1);
      const functionArgConvertSchemaToCommonModel = (
        JsonSchemaInputProcessor.convertSchemaToCommonModel as jest.Mock
      ).mock.calls[0][0];
      expect(functionArgConvertSchemaToCommonModel).toMatchObject(inputSchema);
    });

    test('should process draft 6 schemas', async () => {
      const inputSchemaPath = './JsonSchemaInputProcessor/draft-6.json';
      const { inputMetaModel, inputSchema } =
        await getCommonInput(inputSchemaPath);
      expect(inputMetaModel).toMatchObject({
        models: { test: mockedMetaModel },
        originalInput: inputSchema
      });
      expect(
        JsonSchemaInputProcessor.convertSchemaToCommonModel
      ).toHaveBeenCalledTimes(1);
      const functionArgConvertSchemaToCommonModel = (
        JsonSchemaInputProcessor.convertSchemaToCommonModel as jest.Mock
      ).mock.calls[0][0];
      expect(functionArgConvertSchemaToCommonModel).toMatchObject(inputSchema);
    });

    test('should process draft 4 schemas', async () => {
      const inputSchemaPath = './JsonSchemaInputProcessor/draft-4.json';
      const { inputMetaModel, inputSchema } =
        await getCommonInput(inputSchemaPath);
      expect(inputMetaModel).toMatchObject({
        models: { test: mockedMetaModel },
        originalInput: inputSchema
      });
      expect(
        JsonSchemaInputProcessor.convertSchemaToCommonModel
      ).toHaveBeenCalledTimes(1);
      const functionArgConvertSchemaToCommonModel = (
        JsonSchemaInputProcessor.convertSchemaToCommonModel as jest.Mock
      ).mock.calls[0][0];
      expect(functionArgConvertSchemaToCommonModel).toMatchObject(inputSchema);
    });

    test('should be able to use $ref', async () => {
      const inputSchemaPath = './JsonSchemaInputProcessor/references.json';
      const { inputMetaModel, inputSchema } =
        await getCommonInput(inputSchemaPath);
      const expectedResolvedInput = {
        ...inputSchema,
        properties: { street_address: { type: 'string' } }
      };
      const functionArgConvertSchemaToCommonModel = (
        JsonSchemaInputProcessor.convertSchemaToCommonModel as jest.Mock
      ).mock.calls[0][0];
      expect(inputMetaModel).toMatchObject({
        models: { test: mockedMetaModel },
        originalInput: inputSchema
      });
      expect(
        JsonSchemaInputProcessor.convertSchemaToCommonModel
      ).toHaveBeenCalledTimes(1);
      expect(functionArgConvertSchemaToCommonModel).toMatchObject(
        expectedResolvedInput
      );
    });

    test('should be able to use $ref when circular', async () => {
      const inputSchemaPath =
        './JsonSchemaInputProcessor/references_circular.json';
      const { inputMetaModel, inputSchema } =
        await getCommonInput(inputSchemaPath);
      const expectedResolvedInput = {
        ...inputSchema,
        definitions: {},
        properties: {
          street_address: {
            type: 'object',
            properties: { floor: { type: 'object', properties: {} } }
          }
        }
      };
      const functionArgConvertSchemaToCommonModel = (
        JsonSchemaInputProcessor.convertSchemaToCommonModel as jest.Mock
      ).mock.calls[0][0];
      expect(inputMetaModel).toMatchObject({
        models: { test: mockedMetaModel },
        originalInput: inputSchema
      });
      expect(
        JsonSchemaInputProcessor.convertSchemaToCommonModel
      ).toHaveBeenCalledTimes(1);
      expect(functionArgConvertSchemaToCommonModel).toMatchObject(
        expectedResolvedInput
      );
    });

    test('should fail correctly when reference cannot be resolved', async () => {
      const inputSchemaPath =
        './JsonSchemaInputProcessor/wrong_references.json';
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, inputSchemaPath),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      const processor = new JsonSchemaInputProcessor();
      await expect(processor.process(inputSchema)).rejects.toThrow(
        'Could not dereference $ref in input, is all the references correct?'
      );
    });
  });

  describe('shouldProcess()', () => {
    test('should process draft 7 input schema', () => {
      const processor = new JsonSchemaInputProcessor();
      const shouldProcess = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-07/schema#'
      });
      expect(shouldProcess).toEqual(true);
      const shouldProcess2 = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-07/schema'
      });
      expect(shouldProcess2).toEqual(true);
    });

    test('should process draft 6 input schema', () => {
      const processor = new JsonSchemaInputProcessor();
      const shouldProcess = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-06/schema#'
      });
      expect(shouldProcess).toEqual(true);
      const shouldProcess2 = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-06/schema'
      });
      expect(shouldProcess2).toEqual(true);
    });

    test('should process draft 4 input schema', () => {
      const processor = new JsonSchemaInputProcessor();
      const shouldProcess = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-04/schema#'
      });
      expect(shouldProcess).toEqual(true);
      const shouldProcess2 = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-04/schema'
      });
      expect(shouldProcess2).toEqual(true);
    });

    test('should not process input with wrong $schema', () => {
      const processor = new JsonSchemaInputProcessor();
      const shouldProcess = processor.shouldProcess({
        $schema: 'http://json-schema.org/draft-99/schema#'
      });
      expect(shouldProcess).toEqual(false);
    });

    test('should by default process input if $schema is not defined', () => {
      const processor = new JsonSchemaInputProcessor();
      const shouldProcess = processor.shouldProcess({});
      expect(shouldProcess).toEqual(true);
    });
  });

  describe('dereferenceInputs()', () => {
    test('should handle root $ref', () => {
      const processor = new JsonSchemaInputProcessor();
      const schema = {
        definitions: {
          root: {
            type: 'string'
          }
        },
        $ref: '#/definitions/root'
      };
      const dereferencedSchema = processor.handleRootReference(schema);
      expect(dereferencedSchema).toEqual({
        definitions: { root: { type: 'string' } },
        type: 'string'
      });
    });
    test('should handle root $ref that cannot be processed', () => {
      const processor = new JsonSchemaInputProcessor();
      const schema = {
        definitions: {
          root: {
            definitions: {
              innerRoot: {
                type: 'string'
              }
            }
          }
        },
        $ref: '#/definitions/root/definitions/innerRoot'
      };
      expect(() => processor.handleRootReference(schema)).toThrow(
        'Cannot handle input, because it has a root `$ref`, please manually resolve the first reference.'
      );
    });
  });

  describe('convertSchemaToCommonModel()', () => {
    test('Should ignore models which does not have $id', () => {
      const model = new CommonModel();
      mockedReturnModels = [model];
      const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(
        {}
      );
      expect(Object.entries(commonModels)).toHaveLength(0);
    });
  });

  describe('reflectSchemaName()', () => {
    test('should work', () => {
      const schema = {
        properties: {
          reference: {
            $ref: '#/definitions/def'
          },
          prop: {
            type: 'string'
          },
          allOfCase: {
            allOf: [
              {
                type: 'string'
              },
              {
                type: 'string'
              }
            ]
          },
          object: {
            type: 'object',
            properties: {
              prop: {
                type: 'string'
              }
            }
          },
          propWithObject: {
            type: 'object',
            properties: {
              propWithObject: {
                type: 'object'
              }
            }
          }
        },
        patternProperties: {
          patternProp: {
            type: 'string'
          }
        },
        dependencies: {
          dep: {
            type: 'string'
          }
        },
        definitions: {
          def: {
            type: 'string'
          },
          oneOfCase: {
            oneOf: [
              {
                type: 'string'
              },
              {
                type: 'string'
              }
            ]
          }
        },
        anyOf: [
          {
            type: 'string'
          },
          {
            type: 'object',
            properties: {
              prop: {
                type: 'string'
              }
            }
          }
        ]
      };
      const expected = JsonSchemaInputProcessor.reflectSchemaNames(
        schema,
        {},
        'root',
        true
      ) as any;

      // root
      expect(expected['x-modelgen-inferred-name']).toEqual('root');

      // properties
      expect(
        expected.properties.reference['x-modelgen-inferred-name']
      ).toBeUndefined();
      expect(expected.properties.prop['x-modelgen-inferred-name']).toEqual(
        'prop'
      );
      expect(
        expected.properties.allOfCase.allOf[0]['x-modelgen-inferred-name']
      ).toEqual('allOfCase_allOf_0');
      expect(
        expected.properties.allOfCase.allOf[1]['x-modelgen-inferred-name']
      ).toEqual('allOfCase_allOf_1');
      expect(expected.properties.object['x-modelgen-inferred-name']).toEqual(
        'object'
      );
      expect(
        expected.properties.object.properties.prop['x-modelgen-inferred-name']
      ).toEqual('object_prop');
      expect(
        expected.properties.propWithObject['x-modelgen-inferred-name']
      ).toEqual('propWithObject');
      expect(
        expected.properties.propWithObject.properties.propWithObject[
          'x-modelgen-inferred-name'
        ]
      ).toEqual('propWithObject_propWithObject');

      // patternProperties
      expect(
        expected.patternProperties.patternProp['x-modelgen-inferred-name']
      ).toEqual('pattern_property_0');

      // dependencies
      expect(expected.dependencies.dep['x-modelgen-inferred-name']).toEqual(
        'dep'
      );

      // definitions
      expect(expected.definitions.def['x-modelgen-inferred-name']).toEqual(
        'def'
      );
      expect(
        expected.definitions.oneOfCase.oneOf[0]['x-modelgen-inferred-name']
      ).toEqual('oneOfCase_oneOf_0');
      expect(
        expected.definitions.oneOfCase.oneOf[1]['x-modelgen-inferred-name']
      ).toEqual('oneOfCase_oneOf_1');

      // anyOf
      expect(expected.anyOf[0]['x-modelgen-inferred-name']).toEqual('anyOf_0');
      expect(expected.anyOf[1]['x-modelgen-inferred-name']).toEqual('anyOf_1');
      expect(
        expected.anyOf[1].properties.prop['x-modelgen-inferred-name']
      ).toEqual('anyOf_1_prop');
    });
  });
});
