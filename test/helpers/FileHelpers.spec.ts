import {promises as fs} from 'fs';
import { FileHelpers } from '../../src/helpers';
describe('FileHelpers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('writeToFile', () => {
    test('should write file content to correct location', async () => { 
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
      await FileHelpers.writeToFile('content', '/test/output.ts');
      expect(fs.mkdir).toHaveBeenNthCalledWith(1, '/test', { recursive: true });
      expect(fs.writeFile).toHaveBeenNthCalledWith(1, '/test/output.ts', 'content');
    });
    test('should handle rejected promises', async () => { 
      const error = new Error('Test error');
      jest.spyOn(fs, 'mkdir').mockRejectedValue(error);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
      await expect(FileHelpers.writeToFile('content', '/test/output.ts')).rejects.toEqual(error);
      expect(fs.mkdir).toHaveBeenNthCalledWith(1, '/test', { recursive: true });
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });
});
