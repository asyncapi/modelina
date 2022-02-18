import { InputMetaModel, CommonModel, FileHelpers, JavaScriptFileGenerator, OutputModel } from '../../../src';
import * as path from 'path';

describe('JavaScriptFileGenerator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateToFile()', () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      additionalProperties: true,
      properties: {
        someProp: { type: 'string' },
        someEnum: {
          $id: 'CustomEnum',
          type: 'string',
          enum: ['Texas', 'Alabama', 'California'],
        }
      }
    };
    test('should throw accurate error if file cannot be written', async () => {
      const generator = new JavaScriptFileGenerator();
      const expectedError = new Error('write error');
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockRejectedValue(expectedError);
      jest.spyOn(generator, 'generateCompleteModels').mockResolvedValue([new OutputModel('content', new CommonModel(), 'Test', new InputMetaModel(), [])]);
    
      await expect(generator.generateToFiles(doc, '/test/')).rejects.toEqual(expectedError);
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
    });
    test('should try and generate models to files', async () => {
      const generator = new JavaScriptFileGenerator();
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      const expectedOutputFilePath = path.resolve(`${outputDir}/Test.js`);
      const expectedWriteToFileParameters = [
        'content',
        expectedOutputFilePath,
      ];
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockResolvedValue(undefined);
      jest.spyOn(generator, 'generateCompleteModels').mockResolvedValue([new OutputModel('content', new CommonModel(), 'Test', new InputMetaModel(), [])]);
      
      await generator.generateToFiles(doc, expectedOutputDirPath);
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
      expect((FileHelpers.writerToFileSystem as jest.Mock).mock.calls[0]).toEqual(expectedWriteToFileParameters);
    });
    test('should ignore models that have not been rendered', async () => {
      const generator = new JavaScriptFileGenerator();
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockResolvedValue(undefined);
      jest.spyOn(generator, 'generateCompleteModels').mockResolvedValue([new OutputModel('content', new CommonModel(), '', new InputMetaModel(), [])]);
      
      const models = await generator.generateToFiles(doc, expectedOutputDirPath);
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(0);
      expect(models).toHaveLength(0);
    });
  });
});
