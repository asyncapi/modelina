import * as fs from 'fs';
import * as path from 'path';
import { AnyModel, CommonModel } from '../../src/models';
import { SwaggerInputProcessor } from '../../src/processors/SwaggerInputProcessor';
import { JsonSchemaInputProcessor } from '../../src';
const basicDoc = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './SwaggerInputProcessor/basic.json'),
    'utf8'
  )
);
jest.mock('../../src/utils/LoggingInterface');
jest.spyOn(SwaggerInputProcessor, 'convertToInternalSchema');
const mockedReturnModels = [new CommonModel()];
const mockedMetaModel = new AnyModel('', undefined, {});

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

describe('SwaggerInputProcessor', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('shouldProcess()', () => {
    const processor = new SwaggerInputProcessor();
    test('should be able to process Swagger 2.0', () => {
      const parsedObject = { swagger: '2.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should not be able to process other swagger docs', () => {
      const parsedObject = { swagger: '1.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
    test('should not be able to process document without swagger version', () => {
      const parsedObject = {};
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
  });
  describe('tryGetVersionOfDocument()', () => {
    const processor = new SwaggerInputProcessor();
    test('should be able to find Swagger version from object', () => {
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('2.0');
    });
    test('should not be able to find Swagger version if not present', () => {
      expect(processor.tryGetVersionOfDocument({})).toBeUndefined();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new SwaggerInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not a Swagger document so it cannot be processed.'
      );
    });
    test('should process the swagger document accurately', async () => {
      JsonSchemaInputProcessor.convertSchemaToMetaModel = jest
        .fn()
        .mockImplementation(() => {
          return mockedMetaModel;
        });
      const processor = new SwaggerInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchSnapshot();
      expect(
        (
          SwaggerInputProcessor.convertToInternalSchema as any as jest.SpyInstance
        ).mock.calls
      ).toMatchSnapshot();
    });
  });
});
