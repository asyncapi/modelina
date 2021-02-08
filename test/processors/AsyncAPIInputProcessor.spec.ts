import * as fs from 'fs';
import * as path from 'path';
import {parse} from '@asyncapi/parser';
import {AsyncAPIInputProcessor} from '../../src/processors/AsyncAPIInputProcessor'

describe('AsyncAPIInputProcessor', function() {
    describe('isAsyncAPI()', function() {
        const processor = new AsyncAPIInputProcessor();
        test('should be able to detect pure object', function() {
            const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
            const basicDoc = JSON.parse(basicDocString);
            expect(processor.shouldProcess(basicDoc)).toEqual(true);
        });
        test('should be able to detect parsed object', async function() {
            const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
            const parsedObject = await parse(basicDocString);
            expect(processor.shouldProcess(parsedObject)).toEqual(true);
        });
    });
    describe('isFromParser()', function() {
        test('should be able to detect pure object', function() {
            const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
            const basicDoc = JSON.parse(basicDocString);
            expect(AsyncAPIInputProcessor.isFromParser(basicDoc)).toEqual(false);
        });
        test('should be able to detect parsed object', async function() {
            const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
            const parsedObject = await parse(basicDocString);
            expect(AsyncAPIInputProcessor.isFromParser(parsedObject)).toEqual(true);
        });
    });

    describe('process()', function() {
        test('should be able to process pure object', async function() {
            const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
            const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
            const basicDoc = JSON.parse(basicDocString);
            const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
            const processor = new AsyncAPIInputProcessor();
            const commonInputModel = await processor.process(basicDoc);
            expect(commonInputModel).toEqual(expectedCommonInputModel);
        });
        test('should be able to process parsed objects', async function() {
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