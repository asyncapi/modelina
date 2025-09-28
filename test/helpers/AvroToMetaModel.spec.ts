import {
  AnyModel,
  ArrayModel,
  AvroSchema,
  BooleanModel,
  EnumModel,
  FloatModel,
  IntegerModel,
  ObjectModel,
  StringModel
} from '../../src';
import { AvroToMetaModel } from '../../src/helpers';

describe('AvroToMetaModel', () => {
  describe('nullable', () => {
    test('should apply null and string type', () => {
      const av = new AvroSchema();
      av.name = 'test';
      av.type = ['string', 'null'];

      const model = AvroToMetaModel(av);

      expect(model).not.toBeUndefined();
      expect(model instanceof StringModel).toBeTruthy();
      expect(model.options.isNullable).toBeTruthy();
    });
    test('should not apply null type', () => {
      const av = new AvroSchema();
      av.name = 'test';
      av.type = ['string'];

      const model = AvroToMetaModel(av);

      expect(model).not.toBeUndefined();
      expect(model instanceof StringModel).toBeTruthy();
      expect(model.options.isNullable).toBeFalsy();
    });
  });
  test('should default to any model', () => {
    const av = new AvroSchema();
    av.name = 'test';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toBeTruthy();
  });
  test('should convert to any model', () => {
    const av = new AvroSchema();
    av.type = [
      'string',
      'float',
      'int',
      'double',
      'enum',
      'long',
      'boolean',
      'record',
      'array',
      'null'
    ];
    av.name = 'test';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toBeTruthy();
  });
  test('should convert to any model with missing null', () => {
    const av = new AvroSchema();
    av.type = [
      'string',
      'float',
      'int',
      'double',
      'enum',
      'long',
      'boolean',
      'record',
      'array'
    ];
    av.name = 'test';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toBeTruthy();
  });
  test('should convert to boolean model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'boolean';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof BooleanModel).toEqual(true);
  });
  test('should convert to string model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'string';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof StringModel).toBeTruthy();
  });
  test('should convert type float to float model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'float';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof FloatModel).toBeTruthy();
  });
  test('should convert type double to float model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'double';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof FloatModel).toBeTruthy();
  });
  test('should convert type long to integer model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'long';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof IntegerModel).toBeTruthy();
  });
  test('should convert type int to integer model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'int';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof IntegerModel).toBeTruthy();
  });
  test('should convert to object model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'record';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toBeTruthy();
  });
  test('should convert to enum model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'enum';
    av.symbols = ['hello', '2'];

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof EnumModel).toBeTruthy();
  });
  test('should convert to array model', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = 'array';
    av.items = 'string';

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof ArrayModel).toBeTruthy();
  });
  test('should handle AvroSchema value of type fixed', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = { name: 'test1', type: 'fixed' };

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof StringModel).toBeTruthy();
  });
  test('should handle AvroSchema value of type bytes', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = { name: 'test1', type: 'bytes' };

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof StringModel).toBeTruthy();
  });
  test('should handle AvroSchema value of type', () => {
    const av = new AvroSchema();
    av.name = 'test';
    av.type = { name: 'test1', type: 'int' };

    const model = AvroToMetaModel(av);

    expect(model).not.toBeUndefined();
    expect(model instanceof IntegerModel).toBeTruthy();
  });
});
