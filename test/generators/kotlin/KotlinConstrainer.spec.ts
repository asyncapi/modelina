import { KotlinDefaultTypeMapping } from '../../../src/generators/kotlin/KotlinConstrainer';
import { KotlinGenerator, KotlinOptions } from '../../../src';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedTupleValueModel,
  ConstrainedUnionModel
} from '../../../src';
describe('KotlinConstrainer', () => {
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = KotlinDefaultTypeMapping.Object({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => {
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, {}, '');
      const model = new ConstrainedReferenceModel(
        'test',
        undefined,
        {},
        '',
        refModel
      );
      const type = KotlinDefaultTypeMapping.Reference({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = KotlinDefaultTypeMapping.Any({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Any');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = KotlinDefaultTypeMapping.Float({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Double');
    });
    test('should render Float when format has number format', () => {
      const model = new ConstrainedFloatModel(
        'test',
        {},
        { format: 'float' },
        ''
      );
      const type = KotlinDefaultTypeMapping.Float({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Float');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = KotlinDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Int');
    });
    test('should render Int when format has integer format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int32' },
        ''
      );
      const type = KotlinDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Int');
    });
    test('should render Long when format has long format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'long' },
        ''
      );
      const type = KotlinDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Long');
    });
    test('should render Long when format has int64 format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int64' },
        ''
      );
      const type = KotlinDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Long');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('String');
    });
    test('should render LocalDate when format has date format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'date' },
        ''
      );
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('java.time.LocalDate');
    });
    test('should render OffsetTime when format has time format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'time' },
        ''
      );
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('java.time.OffsetTime');
    });
    test('should render OffsetDateTime when format has dateTime format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'dateTime' },
        ''
      );
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('java.time.OffsetDateTime');
    });
    test('should render OffsetDateTime when format has date-time format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'date-time' },
        ''
      );
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('java.time.OffsetDateTime');
    });
    test('should render byte when format has binary format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'binary' },
        ''
      );
      const type = KotlinDefaultTypeMapping.String({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('ByteArray');
    });
  });

  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = KotlinDefaultTypeMapping.Boolean({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Boolean');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel
      ]);
      const type = KotlinDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('List<Any>');
    });
    test('should render multiple tuple types', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, stringModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel0,
        tupleValueModel1
      ]);
      const type = KotlinDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('List<Any>');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const options: KotlinOptions = {
        ...KotlinGenerator.defaultOptions,
        collectionType: 'Array'
      };
      const type = KotlinDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Array<String>');
    });
    test('should render array as a list', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const options: KotlinOptions = {
        ...KotlinGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = KotlinDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('List<String>');
    });
  });

  describe('Enum', () => {
    test('should render string enum values as String type', () => {
      const enumValue = new ConstrainedEnumValueModel(
        'test',
        'string type',
        {}
      );
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('String');
    });
    test('should render boolean enum values as boolean type', () => {
      const enumValue = new ConstrainedEnumValueModel('test', true, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Boolean');
    });
    test('should render generic number enum value with format', () => {
      const enumValue = new ConstrainedEnumValueModel('test', 123, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Int');
    });
    test('should render generic number enum value with float format as float type', () => {
      const enumValue = new ConstrainedEnumValueModel('test', 12.0, {});
      const model = new ConstrainedEnumModel(
        'test',
        {},
        { format: 'float' },
        '',
        [enumValue]
      );
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Float');
    });
    test('should render generic number enum value with double format as double type', () => {
      const enumValue = new ConstrainedEnumValueModel('test', 12.0, {});
      const model = new ConstrainedEnumModel(
        'test',
        {},
        { format: 'double' },
        '',
        [enumValue]
      );
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Double');
    });
    test('should render object enum value as generic Object', () => {
      const enumValue = new ConstrainedEnumValueModel('test', {}, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Any');
    });
    test('should render multiple value types as generic Object', () => {
      const enumValue2 = new ConstrainedEnumValueModel('test', true, {});
      const enumValue1 = new ConstrainedEnumValueModel(
        'test',
        'string type',
        {}
      );
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue1,
        enumValue2
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Any');
    });
    test('should render double and integer as double type', () => {
      const enumValue2 = new ConstrainedEnumValueModel('test', 123, {});
      const enumValue1 = new ConstrainedEnumValueModel('test', 123.12, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue1,
        enumValue2
      ]);
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Double');
    });
    test('should render int and long as long type', () => {
      const enumValue2 = new ConstrainedEnumValueModel('test', 123, {});
      const enumValue1 = new ConstrainedEnumValueModel('test', 123, {});
      const model = new ConstrainedEnumModel(
        'test',
        {},
        { format: 'long' },
        '',
        [enumValue1, enumValue2]
      );
      const type = KotlinDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Long');
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const unionModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'str'
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionModel
      ]);
      const type = KotlinDefaultTypeMapping.Union({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Any');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const valueModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = KotlinDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        options: KotlinGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('Map<String, String>');
    });
  });
});
