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
        const expectFunction = async (inputSchemaPath: string, expectedCommonModulePath: string, match: boolean = false) => {
            const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
            const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedCommonModulePath), 'utf8');
            const inputSchema = JSON.parse(inputSchemaString);
            const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
            const processor = new JsonSchemaInputProcessor();
            const commonInputModel = await processor.process(inputSchema);
            if(match){
                expect(commonInputModel).toMatchObject(expectedCommonInputModel);
            } else {
                expect(commonInputModel).toEqual(expectedCommonInputModel);
            }
        }
        // test('should be able to process absence types', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/absence_type.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/absence_type.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to process conditional schemas', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/applying_conditional_schemas.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to process combination schemas', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/combination_schemas.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to process enum schemas', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/enum.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/enum.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to process items schemas', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/items.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/items.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to process multiple objects', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        // test('should be able to use $ref', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/references.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath);
        // });
        test('should be able to use $ref when circular', async function() {
            const inputSchemaPath = './JsonSchemaInputProcessor/references_circular.json';
            const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references_circular.json';
            await expectFunction(inputSchemaPath, expectedCommonModulePath, true);
        });
        // test('should be able to use $ref when circular with allOf', async function() {
        //     const inputSchemaPath = './JsonSchemaInputProcessor/references_circular_allOf.json';
        //     const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/references_circular_allOf.json';
        //     await expectFunction(inputSchemaPath, expectedCommonModulePath, true);
        // });
    });

    // describe('schemaToCommonModel()', function() {
    //     /**
    //      * The input schema when converted should be equals to the models of the expected CommonInputModel
    //      * 
    //      * @param inputSchemaPath 
    //      * @param expectedCommonModulePath 
    //      */
    //     const expectFunction = (inputSchemaPath: string, expectedCommonModulePath: string) => {
    //         const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
    //         const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedCommonModulePath), 'utf8');
    //         const inputSchema = Schema.toSchema(JSON.parse(inputSchemaString));
    //         const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString) as CommonInputModel;
    //         const commonInputModel = JsonSchemaInputProcessor.convertSchemaToCommonModel(inputSchema);
    //         expect(commonInputModel).toMatchObject(expectedCommonInputModel.models);
    //     }
    //     test('should be able to process absence types', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/absence_type.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/absence_type.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    //     test('should be able to process conditional schemas', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/applying_conditional_schemas.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    //     test('should be able to process combination schemas', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/combination_schemas.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    //     test('should be able to process enum schemas', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/enum.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/enum.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    //     test('should be able to process items schemas', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/items.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/items.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    //     test('should be able to process multiple objects', async function() {
    //         const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
    //         const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
    //         expectFunction(inputSchemaPath, expectedCommonModulePath);
    //     });
    // });
});
