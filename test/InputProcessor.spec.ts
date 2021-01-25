import * as fs from 'fs';
import * as path from 'path';
import {parse} from '@asyncapi/parser';
import { InputProcessor } from '../src/InputProcessor';
import { AsyncAPIInputProcessor } from '../src/processors/AsyncAPIInputProcessor';
import { JsonSchemaInputProcessor } from '../src/processors/JsonSchemaInputProcessor';
describe('InputProcessor', function() {
    let mainProcessor : InputProcessor;
    beforeAll(() => {
        mainProcessor = new InputProcessor();
        const asyncAPI = new AsyncAPIInputProcessor();
        mainProcessor.addProcessor("asyncapi", asyncAPI); 
        const jsonSchema = new JsonSchemaInputProcessor();
        mainProcessor.addProcessor("json-schema", jsonSchema);
    });

    /**
     * The input schema when processed should be equals to the expected CommonInputModel
     * 
     * @param inputSchemaPath 
     * @param expectedCommonModulePath 
     */
    const expectFunction = async (inputSchemaPath: string, expectedCommonModulePath: string, type: string) => {
        const inputSchemaString = fs.readFileSync(path.resolve(__dirname, inputSchemaPath), 'utf8');
        const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, expectedCommonModulePath), 'utf8');
        const inputSchema = JSON.parse(inputSchemaString);
        const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
        const commonInputModel = await mainProcessor.process(inputSchema, type);
        expect(commonInputModel).toEqual(expectedCommonInputModel);
    }
    describe('process()', function() {
        describe('should be able to process JSON schema input', function() {
            test('with absence types', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/absence_type.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/absence_type.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
            test('with conditional schemas', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/applying_conditional_schemas.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
            test('with combination schemas', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/combination_schemas.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
            test('with enum schemas', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/enum.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/enum.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
            test('with items schemas', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/items.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/items.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
            test('with multiple objects', async function() {
                const inputSchemaPath = './processors/JsonSchemaInputProcessor/multiple_objects.json';
                const expectedCommonModulePath = './processors/JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath, "json-schema");
            });
        });

        describe('should be able to process AsyncAPI schema input', function() {
            test('with pure object', async function() {
                const basicDocString = fs.readFileSync(path.resolve(__dirname, './processors/AsyncAPIInputProcessor/basic.json'), 'utf8');
                const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './processors/AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
                const basicDoc = JSON.parse(basicDocString);
                const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
                const commonInputModel = await mainProcessor.process(basicDoc);
                expect(commonInputModel).toEqual(expectedCommonInputModel);
            });
            test('with parsed document', async function() {
                const basicDocString = fs.readFileSync(path.resolve(__dirname, './processors/AsyncAPIInputProcessor/basic.json'), 'utf8');
                const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './processors/AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
                const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
                const parsedObject = await parse(basicDocString);
                const commonInputModel = await mainProcessor.process(parsedObject);
                expect(commonInputModel).toEqual(expectedCommonInputModel);
            });
        });
    });

});