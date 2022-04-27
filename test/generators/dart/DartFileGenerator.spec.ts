import { CommonInputModel, CommonModel, FileHelpers, DartFileGenerator, OutputModel } from '../../../src';
import * as path from 'path';

describe('DartFileGenerator', () => {
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
      const generator = new DartFileGenerator();
      const expectedError = new Error('write error');
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockRejectedValue(expectedError);
      jest.spyOn(generator, 'generateCompleteModels').mockResolvedValue([new OutputModel('content', new CommonModel(), '', new CommonInputModel(), [])]);
    
      await expect(generator.generateToFiles(doc, '/test/', {packageName: 'SomePackage'})).rejects.toEqual(expectedError);
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
    });
    test('should try and generate models to files', async () => {
      const generator = new DartFileGenerator();
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      const expectedOutputFilePath = path.resolve(`${outputDir}/test.dart`);
      const expectedWriteToFileParameters = [
        'content',
        expectedOutputFilePath,
      ];
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockResolvedValue(undefined);
      jest.spyOn(generator, 'generateCompleteModels').mockResolvedValue([new OutputModel('content', new CommonModel(), 'test', new CommonInputModel(), [])]);
      
      await generator.generateToFiles(doc, expectedOutputDirPath, {packageName: 'SomePackage'});
      expect(generator.generateCompleteModels).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
      expect((FileHelpers.writerToFileSystem as jest.Mock).mock.calls[0]).toEqual(expectedWriteToFileParameters);
    });
  });
});
