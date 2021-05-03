import * as fs from 'fs';
import * as path from 'path';
import { JsonSchemaInputProcessor } from '../../src/processors/JsonSchemaInputProcessor';
import { CommonInputModel, Schema } from '../../src/models';

describe('JsonSchemaInputProcessor', function() {
    describe('process()', function() {
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
        }
        test('should be able to process absence types', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/absence_type.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/absence_type.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process conditional schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/applying_conditional_schemas.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process combination schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/combination_schemas.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process object property with anyOf', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/object_property_with_anyOf.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/object_property_with_anyOf.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process enum schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/enum.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/enum.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process items schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/items.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/items.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process multiple objects', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to use $ref', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/references.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to use $ref when circular', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/references_circular.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references_circular.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to use $ref when circular with allOf', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/references_circular_allOf.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references_circular_allOf.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
    });

    describe('schemaToCommonModel()', function() {
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
        test('should be able to process absence types', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/absence_type.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/absence_type.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process conditional schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/applying_conditional_schemas.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process combination schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/combination_schemas.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process enum schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/enum.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/enum.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process items schemas', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/items.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/items.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
        test('should be able to process multiple objects', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
            expectFunction(inputSchemaPath, expectedCommonModulePath);
        });
    });

    describe('reflectSchemaName()', function() {
        test('should work', async function() {
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
