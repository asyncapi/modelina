import * as fs from 'fs';
import * as path from 'path';
import { JsonSchemaInputProcessor } from '../../src/processors/JsonSchemaInputProcessor';
import { CommonInputModel, CommonModel, Schema } from '../../src/models';
import { simplify } from '../newsimplification/Simplifier';
jest.mock('../../src/newsimplification/Simplifier', () => {
  return {
    Simplifier: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});
jest.mock('../../src/processors/JsonSchemaInputProcessor', () => {
  return {
    JsonSchemaInputProcessor: jest.fn().mockImplementation(() => {
      return {
        simplify: jest.fn().mockReturnValue([new CommonModel()])
      };
    })
  };
});
describe('JsonSchemaInputProcessor', function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('process()', function () {
    /**
     * The input schema when processed should be equals to the expected CommonInputModel
     * 
     * @param inputSchemaPath 
     * @param expectedCommonModulePath 
     */
    const expectFunction = async (inputSchemaPath: string, expectedCommonModulePath: string) => {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
      const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedCommonModulePath), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
      const processor = new JsonSchemaInputProcessor();
      const commonInputModel = await processor.process(inputSchema);
      expect(commonInputModel).toMatchObject(expectedCommonInputModel);
      expect(simplify).toHaveBeenNthCalledWith(1, inputSchema);
    }
    test('should process normal schema', async function () {
      const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
      const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
      await expectFunction(inputSchemaPath, expectedCommonModulePath);
    });
    test('should be able to use $ref', async function () {
      const inputSchemaPath = './JsonSchemaInputProcessor/references.json';
      const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references.json';
      await expectFunction(inputSchemaPath, expectedCommonModulePath);
    });
    test('should be able to use $ref when circular', async function () {
      const inputSchemaPath = './JsonSchemaInputProcessor/references_circular.json';
      const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references_circular.json';
      await expectFunction(inputSchemaPath, expectedCommonModulePath);
    });
  });

  describe('schemaToCommonModel()', function () {
    /**
     * The input schema when converted should be equals to the models of the expected CommonInputModel
     * 
     * @param inputSchemaPath 
     * @param expectedCommonModulePath 
     */
    const expectFunction = (inputSchemaPath: string, expectedCommonModulePath: string) => {
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
      const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedCommonModulePath), 'utf8');
      const inferredSchema = JsonSchemaInputProcessor.reflectSchemaNames(JSON.parse(inputSchemaString), undefined, 'root', true);
      const inputSchema = Schema.toSchema(inferredSchema);
      const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString) as CommonInputModel;
      const commonInputModel = JsonSchemaInputProcessor.convertSchemaToCommonModel(inputSchema);
      expect(commonInputModel).toMatchObject(expectedCommonInputModel.models);
    }
    test('should simplify schema and return a set of common models', async function () {
      jest.mock('../../src/processors/JsonSchemaInputProcessor', () => {
        return {
          JsonSchemaInputProcessor: jest.fn().mockImplementation(() => {
            return {
              simplify: jest.fn().mockReturnValue([new CommonModel()])
            };
          })
        };
      });
      const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
      const inferredSchema = JsonSchemaInputProcessor.reflectSchemaNames(JSON.parse(inputSchemaString), undefined, 'root', true);
      const inputSchema = Schema.toSchema(inferredSchema);
      const commonInputModel = JsonSchemaInputProcessor.convertSchemaToCommonModel(inputSchema);
      expect(simplify).toHaveBeenNthCalledWith(1, inputSchema);
      expect(commonInputModel).toHaveLength(0);
      expect(commonInputModel).toEqual({});
    });
    test('should not contain duplicate models', async function () {
      jest.mock('../../src/processors/JsonSchemaInputProcessor', () => {
        return {
          JsonSchemaInputProcessor: jest.fn().mockImplementation(() => {
            return {
              simplify: jest.fn().mockReturnValue([new CommonModel()])
            };
          })
        };
      });
      const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
      const inferredSchema = JsonSchemaInputProcessor.reflectSchemaNames(JSON.parse(inputSchemaString), undefined, 'root', true);
      const inputSchema = Schema.toSchema(inferredSchema);
      const commonInputModel = JsonSchemaInputProcessor.convertSchemaToCommonModel(inputSchema);
      expect(simplify).toHaveBeenNthCalledWith(1, inputSchema);
      expect(commonInputModel).toHaveLength(0);
      expect(commonInputModel).toEqual({});
    });
  });

  describe('reflectSchemaName()', function () {
    test('should work', async function () {
      const schema = {
        properties: {
          prop: {
            type: "string",
          },
          allOfCase: {
            allOf: [
              {
                type: "string",
              },
              {
                type: "string",
              },
            ],
          },
          object: {
            type: "object",
            properties: {
              prop: {
                type: "string",
              },
            }
          },
          propWithObject: {
            type: "object",
            properties: {
              propWithObject: {
                type: "object",
              }
            }
          },
        },
        patternProperties: {
          patternProp: {
            type: "string",
          }
        },
        dependencies: {
          dep: {
            type: "string",
          },
        },
        definitions: {
          def: {
            type: "string",
          },
          oneOfCase: {
            oneOf: [
              {
                type: "string",
              },
              {
                type: "string",
              },
            ],
          },
        },
        anyOf: [
          {
            type: "string",
          },
          {
            type: "object",
            properties: {
              prop: {
                type: "string",
              },
            }
          },
        ]
      }
      const expected = JsonSchemaInputProcessor.reflectSchemaNames(schema, undefined, 'root', true) as any;

      // root
      expect(expected['x-modelgen-inferred-name']).toEqual('root');

      // properties
      expect(expected.properties.prop['x-modelgen-inferred-name']).toEqual('prop');
      expect(expected.properties.allOfCase.allOf[0]['x-modelgen-inferred-name']).toEqual('allOfCase_allOf_0');
      expect(expected.properties.allOfCase.allOf[1]['x-modelgen-inferred-name']).toEqual('allOfCase_allOf_1');
      expect(expected.properties.object['x-modelgen-inferred-name']).toEqual('object');
      expect(expected.properties.object.properties.prop['x-modelgen-inferred-name']).toEqual('object_prop');
      expect(expected.properties.propWithObject['x-modelgen-inferred-name']).toEqual('propWithObject');
      expect(expected.properties.propWithObject.properties.propWithObject['x-modelgen-inferred-name']).toEqual('propWithObject_propWithObject');

      // patternProperties
      expect(expected.patternProperties.patternProp['x-modelgen-inferred-name']).toEqual('pattern_property_0');

      // dependencies
      expect(expected.dependencies.dep['x-modelgen-inferred-name']).toEqual('dep');

      // definitions
      expect(expected.definitions.def['x-modelgen-inferred-name']).toEqual('def');
      expect(expected.definitions.oneOfCase.oneOf[0]['x-modelgen-inferred-name']).toEqual('oneOfCase_oneOf_0');
      expect(expected.definitions.oneOfCase.oneOf[1]['x-modelgen-inferred-name']).toEqual('oneOfCase_oneOf_1');

      // anyOf
      expect(expected.anyOf[0]['x-modelgen-inferred-name']).toEqual('anyOf_0');
      expect(expected.anyOf[1]['x-modelgen-inferred-name']).toEqual('anyOf_1');
      expect(expected.anyOf[1].properties.prop['x-modelgen-inferred-name']).toEqual('anyOf_1_prop');
    });
  });
});
