import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { TypeScriptInputProcessor } from '../../src/processors';
const baseFile = path.resolve(__dirname, './TypeScriptInputProcessor/index.ts');
const baseFileContents = fs.readFileSync(
  path.resolve(__dirname, './TypeScriptInputProcessor/index.ts'),
  'utf-8'
);
jest.mock('../../src/utils/LoggingInterface');
const mockedReturnModels = [new CommonModel()];
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

describe('TypeScriptInputProcessor', () => {
  describe('shouldProcess()', () => {
    test('should throw error for empty input', async () => {
      const processsor = new TypeScriptInputProcessor();
      await expect(processsor.shouldProcess({})).toBeFalsy();
    });

    test('should process input', () => {
      const processsor = new TypeScriptInputProcessor();
      expect(
        processsor.shouldProcess({ fileContents: baseFileContents, baseFile })
      ).toBeTruthy();
    });
  });
  describe('process()', () => {
    test('should throw error when trying to process wrong input format', async () => {
      const processor = new TypeScriptInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not of the valid file format'
      );
    });
    test('should be able to process input', async () => {
      const processsor = new TypeScriptInputProcessor();
      const commonModel = await processsor.process({
        fileContents: baseFileContents,
        baseFile
      });
      expect(commonModel).toMatchSnapshot();
    });
    test('should be able to process input with user provided options', async () => {
      const processor = new TypeScriptInputProcessor();
      const commonModel = await processor.process(
        { fileContents: baseFileContents, baseFile },
        {
          typescript: {
            uniqueNames: true
          }
        }
      );
      expect(commonModel).toMatchSnapshot();
    });
  });
});
