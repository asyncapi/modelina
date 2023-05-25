import * as fs from 'fs';
import * as path from 'path';
import { Parser } from '@asyncapi/parser';
import { AsyncAPIInputProcessor } from '../../src/processors/AsyncAPIInputProcessor';
import { AnyModel, CommonModel } from '../../src/models';

const basicDocString = fs.readFileSync(
  path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'),
  'utf8'
);
jest.mock('../../src/utils/LoggingInterface');
const mockedReturnModels = [new CommonModel()];
const mockedMetaModel = new AnyModel('', undefined);
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
describe('AsyncAPIInputProcessor', () => {
  const parser = new Parser();

  describe('shouldProcess()', () => {
    const processor = new AsyncAPIInputProcessor();
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(processor.shouldProcess(basicDoc)).toEqual(true);
    });
    test('should be able to detect parsed object', async () => {
      const { document } = await parser.parse(basicDocString);
      expect(processor.shouldProcess(document)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.0.0', () => {
      const parsedObject = { asyncapi: '2.0.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.1.0', () => {
      const parsedObject = { asyncapi: '2.1.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.2.0', () => {
      const parsedObject = { asyncapi: '2.2.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.3.0', () => {
      const parsedObject = { asyncapi: '2.3.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.4.0', () => {
      const parsedObject = { asyncapi: '2.4.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.5.0', () => {
      const parsedObject = { asyncapi: '2.5.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process AsyncAPI 2.6.0', () => {
      const parsedObject = { asyncapi: '2.6.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should not be able to process unsupported AsyncAPI 2.x', () => {
      const parsedObject = { asyncapi: '2.123.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
    test('should not be able to process AsyncAPI 3.x', () => {
      const parsedObject = { asyncapi: '3.0.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
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
      const { document } = await parser.parse(basicDocString);
      expect(processor.tryGetVersionOfDocument(document)).toEqual('2.0.0');
    });
  });
  describe('isFromParser()', () => {
    test('should be able to detect pure object', () => {
      const basicDoc = JSON.parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(basicDoc)).toEqual(false);
    });
    test('should be able to detect parsed object', async () => {
      const { document } = await parser.parse(basicDocString);
      expect(AsyncAPIInputProcessor.isFromParser(document)).toEqual(true);
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process empty schema', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not an AsyncAPI document so it cannot be processed.'
      );
    });

    test('should throw error when trying to process wrong schema', async () => {
      const processor = new AsyncAPIInputProcessor();
      await expect(
        processor.process({ asyncapi: '2.5.0', nonExistingField: {} })
      ).rejects.toThrow(
        'Input is not an correct AsyncAPI document so it cannot be processed.'
      );
    });

    test('should be able to process pure object', async () => {
      const basicDoc = JSON.parse(basicDocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchSnapshot();
    });

    test('should be able to process parsed objects', async () => {
      const { document } = await parser.parse(basicDocString);
      const processor = new AsyncAPIInputProcessor();
      const commonInputModel = await processor.process(document);
      expect(commonInputModel).toMatchSnapshot();
    });
  });

  describe('convertToInternalSchema()', () => {
    test('should work', async () => {
      const basicDocString = fs.readFileSync(
        path.resolve(
          __dirname,
          './AsyncAPIInputProcessor/schema_name_reflection.json'
        ),
        'utf8'
      );
      const { document } = await parser.parse(basicDocString);
      const schema = document
        ?.channels()
        .get('/user/signedup')
        ?.operations()[0]
        .messages()[0]
        ?.payload();
      const expected = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any
      ) as any;

      // root
      expect(expected['x-modelgen-inferred-name']).toEqual('MainSchema');

      // properties
      expect(expected.properties.prop['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_2'
      );
      expect(expected.properties.allOfCase['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_3'
      );
      expect(
        expected.properties.allOfCase.allOf[0]['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_4');
      expect(
        expected.properties.allOfCase.allOf[1]['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_5');
      expect(expected.properties.object['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_6'
      );
      expect(
        expected.properties.object.properties.prop['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_7');
      expect(
        expected.properties.propWithObject['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_8');
      expect(
        expected.properties.propWithObject.properties.propWithObject[
          'x-modelgen-inferred-name'
        ]
      ).toEqual('anonymous_schema_9');

      // patternProperties
      expect(
        expected.patternProperties.patternProp['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_10');

      // dependencies
      expect(expected.dependencies.dep['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_11'
      );

      // definitions
      expect(expected.definitions.def['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_12'
      );
      expect(
        expected.definitions.oneOfCase['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_13');
      expect(
        expected.definitions.oneOfCase.oneOf[0]['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_14');
      expect(
        expected.definitions.oneOfCase.oneOf[1]['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_15');

      // anyOf
      expect(expected.anyOf[0]['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_16'
      );
      expect(expected.anyOf[1]['x-modelgen-inferred-name']).toEqual(
        'anonymous_schema_17'
      );
      expect(
        expected.anyOf[1].properties.prop['x-modelgen-inferred-name']
      ).toEqual('anonymous_schema_18');
    });
    test('should correctly convert when schema has more than one properties referencing one other schema', async () => {
      const basicDocString = fs.readFileSync(
        path.resolve(
          __dirname,
          './AsyncAPIInputProcessor/schema_with_2_properties_referencing_one_schema.json'
        ),
        'utf8'
      );
      const { document } = await parser.parse(basicDocString);
      const schema = document
        ?.channels()
        .get('/user/signedup')
        ?.operations()[0]
        ?.messages()[0]
        ?.payload();
      const result = AsyncAPIInputProcessor.convertToInternalSchema(
        schema as any
      ) as any;

      expect(result.properties['lastName']).not.toEqual({});
      expect(result.properties['firstName']).toEqual(
        result.properties['lastName']
      );
    });
  });
});
