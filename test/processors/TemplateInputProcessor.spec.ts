import { TemplateInputProcessor } from '../../src/processors/TemplateInputProcessor';

describe('TemplateInputProcessor', () => {
  const processor = new TemplateInputProcessor();
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('shouldProcess()', () => {
    test('should be able to process X', () => {
      const input = {};
      expect(processor.shouldProcess(input)).toEqual(true);
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new TemplateInputProcessor();
      await expect(processor.process({})).rejects.toThrow(
        'Input is not X and cannot be processed by this input processor.'
      );
    });
    test('should process X accurately', async () => {
      const input = {};
      const commonInputModel = await processor.process(input);
      expect(commonInputModel).toMatchSnapshot();
    });
  });
});
