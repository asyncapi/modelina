import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import {SwaggerInputProcessor} from '../../src/processors/SwaggerInputProcessor';
const basicDoc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './SwaggerInputProcessor/basic.json'), 'utf8'));
jest.mock('../../src/interpreter/Interpreter');
jest.mock('../../src/interpreter/PostInterpreter');
jest.mock('../../src/utils/LoggingInterface');

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
describe('SwaggerInputProcessor', () => {
  describe('shouldProcess()', () => {
    const processor = new SwaggerInputProcessor();
    test('should be able to detect pure object', () => {
      expect(processor.shouldProcess(basicDoc)).toEqual(true);
    });
    test('should be able to process Swagger 2.0', () => {
      const parsedObject = {swagger: '2.0'};
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
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
      await expect(processor.process({}))
        .rejects
        .toThrow('Input is not a Swagger document so it cannot be processed.');
    });
    test('should process the swagger document accurately', async () => {
      const processor = new SwaggerInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchSnapshot();
    });
  });
});
