import { CommonInputModel, CommonModel, FileHelpers, JavaFileGenerator, OutputModel } from '../../../src';
import * as path from 'path';

describe('JavaFileGenerator', () => {
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
    //   test('should throw accurate error if file cannot be written', async () => {
    //     generator = new JavaGenerator();
    //     const expectedError = new Error('write error');
    //     jest.spyOn(FileHelpers, 'writeToFile').mockRejectedValue(expectedError);
    //     jest.spyOn(generator, 'generateFullOutput').mockResolvedValue([new OutputModel('content', new CommonModel(), '', new CommonInputModel(), [])]);
      
    //     await expect(generator.generateToFile(doc, '/test/', 'SomePackage')).rejects.toEqual(expectedError);
    //     expect(generator.generateFullOutput).toHaveBeenCalledTimes(1);
    //     expect(FileHelpers.writeToFile).toHaveBeenCalledTimes(1);
    //   });
    test('should try and generate models to files', async () => {
      const generator = new JavaFileGenerator();
      const outputDir = './test';
      const expectedOutputDirPath = path.resolve(outputDir);
      const expectedOutputFilePath = path.resolve(`${outputDir}/Test.java`);
      const expectedWriteToFileParameters = [
        'content',
        expectedOutputFilePath,
      ];
      jest.spyOn(FileHelpers, 'writerToFileSystem').mockResolvedValue(undefined);
      jest.spyOn(generator, 'generateFull').mockResolvedValue([new OutputModel('content', new CommonModel(), 'Test', new CommonInputModel(), [])]);
      
      await generator.generateToSeparateFiles(doc, expectedOutputDirPath, {packageName: 'SomePackage'});
      expect(generator.generateFull).toHaveBeenCalledTimes(1);
      expect(FileHelpers.writerToFileSystem).toHaveBeenCalledTimes(1);
      expect((FileHelpers.writerToFileSystem as jest.Mock).mock.calls[0]).toEqual(expectedWriteToFileParameters);
    });
  });

  // describe('generateFullOutput()', () => {
  //   const doc = {
  //     $id: 'CustomClass',
  //     type: 'object',
  //     additionalProperties: true,
  //     properties: {
  //       someProp: { type: 'string' },
  //       someEnum: {
  //         $id: 'CustomEnum',
  //         type: 'string',
  //         enum: ['Texas', 'Alabama', 'California'],
  //       }
  //     }
  //   };
  //   test('should not be able to use reserved keywords as package name', async () => {
  //     generator = new JavaGenerator();
  //     await expect(generator.generateFull(doc, {packageName: 'package'})).rejects.toEqual(new Error('You cannot use reserved Java keyword (package) as package name, please use another.'));
  //   });
  //   test('should generate models to files', async () => {
  //     generator = new JavaGenerator();
  //     jest.spyOn(FileHelpers, 'writeToFile').mockResolvedValue(undefined);
  //     const output = await generator.generateFile(doc, 'output', {packageName: 'SomePackage'}, async (content, file) => {await fs.promises.writeFile(file, content);});
  //     expect(output).toHaveLength(2);
  //     expect(output[0].result).toMatchSnapshot();
  //     expect(output[1].result).toMatchSnapshot();
  //   });
  // });
});
