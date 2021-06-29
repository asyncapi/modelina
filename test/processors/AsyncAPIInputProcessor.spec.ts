import * as fs from 'fs';
import * as path from 'path';
import {parse} from '@asyncapi/parser';
import {AsyncAPIInputProcessor} from '../../src/processors/AsyncAPIInputProcessor';
const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');

describe('AsyncAPIInputProcessor', () => {
  describe('shouldProcess()', () => {
    const processor = new AsyncAPIInputProcessor();
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(processor.shouldProcess(basicDoc)).toEqual(true);
    });
    test('should be able to detect parsed object', async () => {
      const parsedObject = await parse(basicDocString);
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.0.0', () => {
      const parsedObject = {asyncapi: '2.0.0'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.1.0', () => {
      const parsedObject = {asyncapi: '2.1.0'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
  });
  describe('tryGetVersionOfDocument()', () => {
    const processor = new AsyncAPIInputProcessor();
    test('should be able to find AsyncAPI version from object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('2.0.0');
    });
    test('should not be able to find AsyncAPI version if not present', () => {
      expect(processor.tryGetVersionOfDocument({})).toBeUndefined();
    });
    test('should be able to find AsyncAPI version from parsed document', async () => {
      const parsedObject = await parse(basicDocString);
      expect(processor.tryGetVersionOfDocument(parsedObject)).toEqual('2.0.0');
    });
  });
  describe('isFromParser()', () => {
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(basicDoc)).toEqual(false);
    });
    test('should be able to detect parsed object', async () => {
      const parsedObject = await parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(parsedObject)).toEqual(true);
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(processor.process({}))
        .rejects
        .toThrow('Input is not an AsyncAPI document so it cannot be processed.');
    });
    test('should be able to process pure object', async () => {
      const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
      const basicDoc = JSON.parse(basicDocString);
      const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchObject(expectedCommonInputModel);
    });
    test('should be able to process parsed objects', async () => {
      const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/commonInputModel/basic.json'), 'utf8');
      const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
      const parsedObject = await parse(basicDocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(parsedObject);
      expect(commonInputModel).toMatchObject(expectedCommonInputModel);
    });
  });

  describe('convertToInternalSchema()', () => {
    test('should work', async () => {
      const basicDocString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/schema_name_reflection.json'), 'utf8');
      const doc = await parse(basicDocString);
      const schema = doc.channels()['/user/signedup'].subscribe().message().payload();
      const expected = AsyncAPIInputProcessor.convertToInternalSchema(schema) as any;

      // root
      expect(expected['x-modelgen-inferred-name']).toEqual('MainSchema');

      // properties
      expect(expected.properties.prop['x-modelgen-inferred-name']).toEqual('<anonymous-schema-2>');
      expect(expected.properties.allOfCase['x-modelgen-inferred-name']).toEqual('<anonymous-schema-3>');
      expect(expected.properties.allOfCase.allOf[0]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-4>');
      expect(expected.properties.allOfCase.allOf[1]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-5>');
      expect(expected.properties.object['x-modelgen-inferred-name']).toEqual('<anonymous-schema-6>');
      expect(expected.properties.object.properties.prop['x-modelgen-inferred-name']).toEqual('<anonymous-schema-7>');
      expect(expected.properties.propWithObject['x-modelgen-inferred-name']).toEqual('<anonymous-schema-8>');
      expect(expected.properties.propWithObject.properties.propWithObject['x-modelgen-inferred-name']).toEqual('<anonymous-schema-9>');

      // patternProperties
      expect(expected.patternProperties.patternProp['x-modelgen-inferred-name']).toEqual('<anonymous-schema-10>');

      // dependencies
      expect(expected.dependencies.dep['x-modelgen-inferred-name']).toEqual('<anonymous-schema-11>');

      // definitions
      expect(expected.definitions.def['x-modelgen-inferred-name']).toEqual('<anonymous-schema-12>');
      expect(expected.definitions.oneOfCase['x-modelgen-inferred-name']).toEqual('<anonymous-schema-13>');
      expect(expected.definitions.oneOfCase.oneOf[0]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-14>');
      expect(expected.definitions.oneOfCase.oneOf[1]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-15>');

      // anyOf
      expect(expected.anyOf[0]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-16>');
      expect(expected.anyOf[1]['x-modelgen-inferred-name']).toEqual('<anonymous-schema-17>');
      expect(expected.anyOf[1].properties.prop['x-modelgen-inferred-name']).toEqual('<anonymous-schema-18>');
    });
  });
});
