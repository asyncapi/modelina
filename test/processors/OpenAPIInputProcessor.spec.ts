import * as fs from 'fs';
import * as path from 'path';
import { AnyModel, CommonModel } from '../../src/models';
import { OpenAPIInputProcessor } from '../../src/processors/OpenAPIInputProcessor';
const basicDoc = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './OpenAPIInputProcessor/basic.json'),
    'utf8'
  )
);
const noPathsDoc = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './OpenAPIInputProcessor/no_paths.json'),
    'utf8'
  )
);
const circularDoc = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './OpenAPIInputProcessor/references_circular.json'),
    'utf8'
  )
);
jest.mock('../../src/utils/LoggingInterface');
const processorSpy = jest.spyOn(
  OpenAPIInputProcessor,
  'convertToInternalSchema'
);
const mockedReturnModels = [new CommonModel()];
const mockedMetaModel = new AnyModel('', undefined, {});
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
describe('OpenAPIInputProcessor', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('shouldProcess()', () => {
    const processor = new OpenAPIInputProcessor();
    test('should be able to process OpenAPI 3.0.0 documents', () => {
      const parsedObject = { openapi: '3.0.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.1 documents', () => {
      const parsedObject = { openapi: '3.0.1' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.2 documents', () => {
      const parsedObject = { openapi: '3.0.2' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.0.3 documents', () => {
      const parsedObject = { openapi: '3.0.3' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should be able to process OpenAPI 3.1.0 documents', () => {
      const parsedObject = { openapi: '3.1.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(true);
    });
    test('should not be able to process other OpenAPI docs', () => {
      const parsedObject = { openapi: '1.0' };
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
    test('should not be able to process document without OpenAPI version', () => {
      const parsedObject = {};
      expect(processor.shouldProcess(parsedObject)).toEqual(false);
    });
  });
  describe('tryGetVersionOfDocument()', () => {
    const processor = new OpenAPIInputProcessor();
    test('should be able to find OpenAPI version from object', () => {
      expect(processor.tryGetVersionOfDocument(basicDoc)).toEqual('3.0.3');
    });
    test('should not be able to find OpenAPI version if not present', () => {
      expect(processor.tryGetVersionOfDocument({})).toBeUndefined();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new OpenAPIInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not a OpenAPI document so it cannot be processed'
      );
    });
    test('should process the OpenAPI document accurately', async () => {
      const processor = new OpenAPIInputProcessor();
      const commonInputModel = await processor.process(basicDoc);
      expect(commonInputModel).toMatchSnapshot();
      expect(processorSpy.mock.calls).toMatchSnapshot();
    });
    test('should process the OpenAPI document with no paths', async () => {
      const processor = new OpenAPIInputProcessor();
      const commonInputModel = await processor.process(noPathsDoc, {
        openapi: { includeComponentSchemas: true }
      });
      expect(commonInputModel).toMatchSnapshot();
      expect(processorSpy.mock.calls).toMatchSnapshot();
    });
    test('should include schema for parameters', async () => {
      const doc = {
        openapi: '3.0.3',
        info: {},
        paths: {
          '/test': {
            parameters: [
              {
                name: 'path_parameter',
                in: 'header',
                schema: { type: 'string' }
              }
            ],
            get: {
              parameters: [
                {
                  name: 'operation_parameter',
                  in: 'query',
                  schema: { type: 'string' }
                }
              ],
              responses: {
                204: {}
              }
            }
          }
        }
      };

      const processor = new OpenAPIInputProcessor();
      await processor.process(doc);
      expect(processorSpy.mock.calls).toContainEqual([
        { type: 'string' },
        'test_get_parameters_query_operation_parameter'
      ]);
      expect(processorSpy.mock.calls).toContainEqual([
        { type: 'string' },
        'test_parameters_header_path_parameter'
      ]);
    });
    test('should be able to use $ref when circular', async () => {
      const processor = new OpenAPIInputProcessor();
      const commonInputModel = await processor.process(circularDoc);
      expect(commonInputModel).toMatchSnapshot();
      expect(processorSpy.mock.calls).toMatchSnapshot();
    });
  });
});
