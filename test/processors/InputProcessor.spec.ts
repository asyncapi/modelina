import * as fs from 'fs';
import * as path from 'path';
import { CommonInputModel } from '../../src/models';
import { InputProcessor } from '../../src/processors/InputProcessor';
import { JsonSchemaInputProcessor } from '../../src/processors/JsonSchemaInputProcessor';
import { AsyncAPIInputProcessor } from '../../src/processors/AsyncAPIInputProcessor';
import { AbstractInputProcessor } from '../../src/processors';

describe('InputProcessor', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  
  class TempProcessor extends AbstractInputProcessor {
    process(input: any): Promise<CommonInputModel> { return Promise.resolve(new CommonInputModel()); }
    shouldProcess(input: any): boolean { return true; }
  }
  test('should add processor to map', () => {
    const testProcessor = new TempProcessor();
    const processor = new InputProcessor();
    processor.setProcessor('some_key', testProcessor);
    const processors = processor.getProcessors();
    const foundProcessor = processors.get('some_key');
    expect(foundProcessor).toEqual(testProcessor);
  });
  test('overwriting processor should use new and not old', () => {
    const testProcessor = new TempProcessor();
    const processor = new InputProcessor();
    const oldDefaultProcessor = processor.getProcessors().get('default');
    processor.setProcessor('default', testProcessor);
    const currentDefaultProcessor = processor.getProcessors().get('default');
    expect(currentDefaultProcessor?.constructor).not.toEqual(oldDefaultProcessor?.constructor);
    expect(oldDefaultProcessor?.constructor).toEqual(oldDefaultProcessor?.constructor);
    expect(currentDefaultProcessor?.constructor).toEqual(currentDefaultProcessor?.constructor);
  });
  describe('process()', () => {
    const getProcessors = () => {
      const asyncInputProcessor = new AsyncAPIInputProcessor();
      jest.spyOn(asyncInputProcessor, 'shouldProcess');
      jest.spyOn(asyncInputProcessor, 'process');
      const defaultInputProcessor = new JsonSchemaInputProcessor();
      jest.spyOn(defaultInputProcessor, 'shouldProcess');
      jest.spyOn(defaultInputProcessor, 'process');
      const processor = new InputProcessor();
      processor.setProcessor('asyncapi', asyncInputProcessor);
      processor.setProcessor('default', defaultInputProcessor);
      return {processor, asyncInputProcessor, defaultInputProcessor};
    };
    test('should throw error when no default processor found', async () => {
      const processor = new InputProcessor();
      const map = processor.getProcessors();
      map.delete('default');
      await expect(processor.process({}))
        .rejects
        .toThrow('No default processor found');
    });
    test('should be able to process default JSON schema input', async () => {
      const {processor, asyncInputProcessor, defaultInputProcessor} = getProcessors(); 
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './JsonSchemaInputProcessor/basic.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(asyncInputProcessor.process).not.toHaveBeenCalled();
      expect(asyncInputProcessor.shouldProcess).toHaveBeenNthCalledWith(1, inputSchema);
      expect(defaultInputProcessor.process).toHaveBeenNthCalledWith(1, inputSchema);
      expect(defaultInputProcessor.shouldProcess).toHaveBeenNthCalledWith(1, inputSchema);
    });

    test('should be able to process AsyncAPI schema input', async () => {
      const {processor, asyncInputProcessor, defaultInputProcessor} = getProcessors(); 
      const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'), 'utf8');
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(asyncInputProcessor.process).toHaveBeenNthCalledWith(1, inputSchema);
      expect(asyncInputProcessor.shouldProcess).toHaveBeenNthCalledWith(1, inputSchema);
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });
  });
});
