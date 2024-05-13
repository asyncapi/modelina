import * as fs from 'fs';
import * as path from 'path';
import { InputMetaModel, ProcessorOptions } from '../../src/models';
import {
  AbstractInputProcessor,
  AsyncAPIInputProcessor,
  AvroSchemaInputProcessor,
  JsonSchemaInputProcessor,
  InputProcessor,
  SwaggerInputProcessor
} from '../../src/processors';
import { OpenAPIInputProcessor } from '../../src/processors/OpenAPIInputProcessor';

describe('InputProcessor', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  class TempProcessor extends AbstractInputProcessor {
    process(input: any): Promise<InputMetaModel> {
      return Promise.resolve(new InputMetaModel());
    }
    shouldProcess(input: any): boolean {
      return true;
    }
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
    expect(currentDefaultProcessor?.constructor).not.toEqual(
      oldDefaultProcessor?.constructor
    );
    expect(oldDefaultProcessor?.constructor).toEqual(
      oldDefaultProcessor?.constructor
    );
    expect(currentDefaultProcessor?.constructor).toEqual(
      currentDefaultProcessor?.constructor
    );
  });

  describe('process()', () => {
    const getProcessors = () => {
      const asyncInputProcessor = new AsyncAPIInputProcessor();
      jest.spyOn(asyncInputProcessor, 'shouldProcess');
      jest.spyOn(asyncInputProcessor, 'process');
      const avroSchemaInputProcessor = new AvroSchemaInputProcessor();
      jest.spyOn(avroSchemaInputProcessor, 'shouldProcess');
      jest.spyOn(avroSchemaInputProcessor, 'process');
      const defaultInputProcessor = new JsonSchemaInputProcessor();
      jest.spyOn(defaultInputProcessor, 'shouldProcess');
      jest.spyOn(defaultInputProcessor, 'process');
      const swaggerInputProcessor = new SwaggerInputProcessor();
      jest.spyOn(swaggerInputProcessor, 'shouldProcess');
      jest.spyOn(swaggerInputProcessor, 'process');
      const openAPIInputProcessor = new OpenAPIInputProcessor();
      jest.spyOn(openAPIInputProcessor, 'shouldProcess');
      jest.spyOn(openAPIInputProcessor, 'process');
      const processor = new InputProcessor();
      processor.setProcessor('asyncapi', asyncInputProcessor);
      processor.setProcessor('swagger', swaggerInputProcessor);
      processor.setProcessor('avro', avroSchemaInputProcessor);
      processor.setProcessor('openapi', openAPIInputProcessor);
      processor.setProcessor('default', defaultInputProcessor);
      return {
        processor,
        asyncInputProcessor,
        swaggerInputProcessor,
        avroSchemaInputProcessor,
        openAPIInputProcessor,
        defaultInputProcessor
      };
    };
    test('should throw error when no default processor found', async () => {
      const processor = new InputProcessor();
      const map = processor.getProcessors();
      map.delete('default');
      await expect(processor.process({})).rejects.toThrow(
        'No default processor found'
      );
    });
    test('should be able to process default JSON schema input', async () => {
      const { processor, asyncInputProcessor, defaultInputProcessor } =
        getProcessors();
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './JsonSchemaInputProcessor/draft-7.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(asyncInputProcessor.process).not.toHaveBeenCalled();
      expect(asyncInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        undefined
      );
      expect(defaultInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
    });

    test('should be able to process AsyncAPI schema input', async () => {
      const { processor, asyncInputProcessor, defaultInputProcessor } =
        getProcessors();
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(asyncInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        undefined
      );
      expect(asyncInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });

    test('should be able to process Swagger (OpenAPI 2.0) input', async () => {
      const { processor, swaggerInputProcessor, defaultInputProcessor } =
        getProcessors();
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './SwaggerInputProcessor/basic.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(swaggerInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        undefined
      );
      expect(swaggerInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });
    test('should be able to process OpenAPI input', async () => {
      const { processor, openAPIInputProcessor, defaultInputProcessor } =
        getProcessors();
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './OpenAPIInputProcessor/basic.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(openAPIInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        undefined
      );
      expect(openAPIInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });
    test('should be able to process Avro Schema input', async () => {
      const { processor, avroSchemaInputProcessor, defaultInputProcessor } =
        getProcessors();
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './AvroSchemaInputProcessor/basic.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema);
      expect(avroSchemaInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        undefined
      );
      expect(avroSchemaInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });
    test('should be able to process AsyncAPI schema input with options', async () => {
      const { processor, asyncInputProcessor, defaultInputProcessor } =
        getProcessors();
      const options: ProcessorOptions = {
        asyncapi: {
          source: 'test'
        }
      };
      const inputSchemaString = fs.readFileSync(
        path.resolve(__dirname, './AsyncAPIInputProcessor/basic.json'),
        'utf8'
      );
      const inputSchema = JSON.parse(inputSchemaString);
      await processor.process(inputSchema, options);
      expect(asyncInputProcessor.process).toHaveBeenNthCalledWith(
        1,
        inputSchema,
        options
      );
      expect(asyncInputProcessor.shouldProcess).toHaveBeenNthCalledWith(
        1,
        inputSchema
      );
      expect(defaultInputProcessor.process).not.toHaveBeenCalled();
      expect(defaultInputProcessor.shouldProcess).not.toHaveBeenCalled();
    });
  });
});
