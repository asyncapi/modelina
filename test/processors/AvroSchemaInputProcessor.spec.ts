import * as fs from 'fs';
import * as path from 'path';
import { AvroSchemaInputProcessor } from '../../src/processors';

const basicDoc = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './AvroSchemaInputProcessor/basic.json'),
    'utf8'
  )
);
describe('AvroSchemaInputProcessor', () => {
  describe('shouldProcess()', () => {
    const processor = new AvroSchemaInputProcessor();
    test('should fail correctly for empty string input', () => {
      expect(processor.shouldProcess('')).toBeFalsy();
    });

    test('should fail correctly for empty object input', () => {
      expect(processor.shouldProcess({})).toBeFalsy();
    });

    test('should fail correctly for empty array input', () => {
      expect(processor.shouldProcess([])).toBeFalsy();
    });

    test('should fail if input has no name property', () => {
      expect(
        processor.shouldProcess({ prop: 'hello', type: 'string' })
      ).toBeFalsy();
    });

    test('should fail if input has no type property', () => {
      expect(
        processor.shouldProcess({ name: 'hello', someKey: 'someValue' })
      ).toBeFalsy();
    });

    test('should return true for valid input', () => {
      const processor = new AvroSchemaInputProcessor();
      const result = processor.shouldProcess({ name: 'hello', type: 'string' });
      expect(result).toBeTruthy();
    });
    test('should fail for invalid type', () => {
      const processor = new AvroSchemaInputProcessor();
      const result = processor.shouldProcess({
        name: 'hello',
        type: 'someValue'
      });
      expect(result).toBeFalsy();
    });
  });

  describe('process()', () => {
    test('should throw error when trying to process wrong schema', async () => {
      const processor = new AvroSchemaInputProcessor();
      await expect(processor.process({ someKey: 'someValue' })).rejects.toThrow(
        'Input is not an Avro Schema, so it cannot be processed.'
      );
    });

    test('should process Avro Schema', async () => {
      const processor = new AvroSchemaInputProcessor();
      const result = await processor.process(basicDoc);
      expect(result).toMatchSnapshot();
    });
  });
});
