import { promises as fs } from 'fs';
import { FileHelpers } from '../../src';
import * as path from 'path';
describe('FileHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('writerToFileSystem', () => {
    test('should write file content to correct location', async () => {
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

      const outputDir = './test';
      const outputFile = `${outputDir}/output.ts`;
      const expectedOutputDirPath = path.resolve(outputDir);
      const expectedOutputFilePath = path.resolve(outputFile);
      await FileHelpers.writerToFileSystem('content', outputFile);

      expect(fs.mkdir).toHaveBeenNthCalledWith(1, expectedOutputDirPath, {
        recursive: true
      });
      expect(fs.writeFile).toHaveBeenNthCalledWith(
        1,
        expectedOutputFilePath,
        'content'
      );
    });
    test('should handle rejected promises', async () => {
      const error = new Error('Test error');
      jest.spyOn(fs, 'mkdir').mockRejectedValue(error);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);

      const outputDir = './test';
      const outputFile = `${outputDir}/output.ts`;
      const expectedOutputPath = path.resolve(outputDir);

      await expect(
        FileHelpers.writerToFileSystem('content', outputFile)
      ).rejects.toEqual(error);
      expect(fs.mkdir).toHaveBeenNthCalledWith(1, expectedOutputPath, {
        recursive: true
      });
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
