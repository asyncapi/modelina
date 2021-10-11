import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import {OpenapiInputProcessor} from '../../src/processors/OpenAPIInputProcessor';
const basicDoc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './OpenAPIInputProcessor/basic.json'), 'utf8'));
jest.mock('../../src/interpreter/Interpreter');
jest.mock('../../src/interpreter/PostInterpreter');
jest.mock('../../src/utils/LoggingInterface');
jest.spyOn(OpenapiInputProcessor, 'convertToInternalSchema');

const mockedReturnModels = [new CommonModel()];
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return mockedReturnModels[0];})
      };
    })
  };
});
jest.mock('../../src/interpreter/PostInterpreter', () => {
  return {
    postInterpretModel: jest.fn().mockImplementation(() => {return mockedReturnModels;})
  };
});
describe('OpenapiInputProcessor', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('shouldProcess()', () => {
    const processor = new OpenapiInputProcessor();
    test('should be able to process OpenAPI 3.0.0 documents', () => {
      const parsedObject = {openapi: '3.0.0'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.1 documents', () => {
      const parsedObject = {openapi: '3.0.1'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.2 documents', () => {
      const parsedObject = {openapi: '3.0.2'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.3 documents', () => {
      const parsedObject = {openapi: '3.0.3'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should not be able to process other OpenAPI docs', () => {
      const parsedObject = {openapi: '1.0'};
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
    test('should not be able to process document without OpenAPI version', () => {
      const parsedObject = {};
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
  });
  describe('tryGetVersionOfDocument()', () => {
    const processor = new OpenapiInputProcessor();
    test('should be able to find OpenAPI version from object', () => {
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('3.0.3');
    });
    test('should not be able to find OpenAPI version if not present', () => {
      expect(processor.tryGetVersionOfDocument({})).toBeUndefined();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new OpenapiInputProcessor();
      await expect(processor.process({}))
        .rejects
        .toThrow('Input is not a OpenAPI document so it cannot be processed');
    });
    test('should process the OpenAPI document accurately', async () => {
      const processor = new OpenapiInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchSnapshot();
      expect((OpenapiInputProcessor.convertToInternalSchema as any as jest.SpyInstance).mock.calls).toMatchSnapshot();
    });
  });
});
