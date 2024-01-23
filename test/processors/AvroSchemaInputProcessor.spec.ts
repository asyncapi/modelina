import { InputMetaModel } from '../../src/models';
import { AvroSchemaInputProcessor } from '../../src/processors';

describe('AvroSchemaInputProcessor', () => {
  describe('shouldProcess()', () => {
    test('should fail correctly for empty string input', () => {
      const processor = new AvroSchemaInputProcessor();
      expect(processor.shouldProcess('')).toBeFalsy();
    });

    test('should fail correctly for empty object input', () => {
      const processor = new AvroSchemaInputProcessor();
      expect(processor.shouldProcess({})).toBeFalsy();
    });

    test('should fail correctly for empty array input', () => {
      const processor = new AvroSchemaInputProcessor();
      expect(processor.shouldProcess([])).toBeFalsy();
    });

    test('should fail if input has no type property', () => {
      const processor = new AvroSchemaInputProcessor();
      expect(processor.shouldProcess({ someKey: 'someValue' })).toBeFalsy();
    });

    test('should return true for valid input', () => {
      const processor = new AvroSchemaInputProcessor();
      const result = processor.shouldProcess({ type: 'someType' });
      expect(result).toBeTruthy();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new AvroSchemaInputProcessor();
      // const invalidInput = { someKey: 'someValue' };
      await expect(processor.process({ someKey: 'someValue' })).rejects.toThrow(
        'Input is not an Avro Schema, so it cannot be processed.'
      );
    });

    test('should process Avro Schema', async () => {
      const processor = new AvroSchemaInputProcessor();
      // const validInput = { type: 'someType' };
      const result = await processor.process({ type: 'someType' });
      expect(result).toBeInstanceOf(InputMetaModel);
    });
  });
});
