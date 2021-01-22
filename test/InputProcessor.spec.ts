import * as fs from 'fs';
import * as path from 'path';
import {parse} from '@asyncapi/parser';
import { JsonSchemaInputProcessor } from '../src/processors/JsonSchemaInputProcessor';
import { AsyncAPIInputProcessor } from '../src/processors/AsyncAPIInputProcessor';
describe('InputProcessor', function() {
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
            expect(commonInputModel).toEqual(expectedCommonInputModel);
        }
        describe('should be able to process JSON schema input', function() {
            test('with absence types', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/absence_type.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/absence_type.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
            test('with conditional schemas', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/applying_conditional_schemas.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/applying_conditional_schemas.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
            test('with combination schemas', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/combination_schemas.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/combination_schemas.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
            test('with enum schemas', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/enum.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/enum.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
            test('with items schemas', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/items.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/items.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
            test('with multiple objects', async function() {
                const inputSchemaPath = './JsonSchemaInputProcessor/multiple_objects.json';
                const expectedCommonModulePath = './JsonSchemaInputProcessor/commonInputModel/multiple_objects.json';
                await expectFunction(inputSchemaPath, expectedCommonModulePath);
            });
        });

        describe('should be able to process AsyncAPI schema input', function() {
            test('with pure object', async function() {
                const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
                const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
                const basicDoc = JSON.parse(basicDocString);
                const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
                const processor = new AsyncAPIInputProcessor();
                const commonInputModel = await processor.process(basicDoc);
                expect(commonInputModel).toEqual(expectedCommonInputModel);
            });
            test('with parsed document', async function() {
                const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
                const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
                const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
                const parsedObject = await parse(basicDocString);
                const processor = new AsyncAPIInputProcessor();
                const commonInputModel = await processor.process(parsedObject);
                expect(commonInputModel).toEqual(expectedCommonInputModel);
            });
        });
    });

});