import { JavaDefaultTypeMapping } from '../../../src/generators/java/JavaConstrainer';
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
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel,
  JavaGenerator,
  JavaOptions
} from '../../../src';
import { JavaDependencyManager } from '../../../src/generators/java/JavaDependencyManager';
describe('JavaConstrainer', () => {
  const defaultOptions = {
    options: JavaGenerator.defaultOptions,
    dependencyManager: new JavaDependencyManager(JavaGenerator.defaultOptions)
  };
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = JavaDefaultTypeMapping.Object({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
    test('should render the constrained name as type for unions with ConstrainedObjectModel types', () => {
      const unionType = new ConstrainedObjectModel(
        'union-type-name',
        undefined,
        {},
        'UnionType',
        {}
      );
      const union = new ConstrainedUnionModel('Union', undefined, {}, '', [
        unionType
      ]);
      const model = new ConstrainedReferenceModel(
        'test',
        undefined,
        {},
        '',
        union
      );
      const type = JavaDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  test('should render Object for unions with built-in types', () => {
    const unionType = new ConstrainedAnyModel(
      'String',
      undefined,
      {},
      'String'
    );
    const union = new ConstrainedUnionModel('Union', undefined, {}, '', [
      unionType
    ]);
    const model = new ConstrainedReferenceModel(
      'test',
      undefined,
      {},
      '',
      union
    );
    const type = JavaDefaultTypeMapping.Reference({
      constrainedModel: model,
      ...defaultOptions
    });
    expect(type).toEqual('Object');
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.Any({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.Float({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('double');
    });
    test('should render optional type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.Float({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          false,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('Double');
    });
    test('should render nullable type', () => {
      const model = new ConstrainedFloatModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = JavaDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Double');
    });
    test('should render double when format has number format', () => {
      const model = new ConstrainedFloatModel(
        'test',
        {},
        { format: 'float' },
        ''
      );
      const type = JavaDefaultTypeMapping.Float({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
    test('should render nullable type', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Integer');
    });
    test('should render int when format has integer format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'integer' },
        ''
      );
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
    test('should render int when format has int32 format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int32' },
        ''
      );
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
    test('should render long when format has long format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'long' },
        ''
      );
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('long');
    });
    test('should render long when format has int64 format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int64' },
        ''
      );
      const type = JavaDefaultTypeMapping.Integer({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('long');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
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
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('byte[]');
    });
    test('should render Duration when format has duration format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'duration' },
        ''
      );
      const type = JavaDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('java.time.Duration');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = JavaDefaultTypeMapping.Boolean({
        constrainedModel: model,
        partOfProperty: new ConstrainedObjectPropertyModel(
          'test',
          'test',
          true,
          model
        ),
        ...defaultOptions
      });
      expect(type).toEqual('boolean');
    });
    test('should render nullable type', () => {
      const model = new ConstrainedBooleanModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = JavaDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Boolean');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
      const type = JavaDefaultTypeMapping.Tuple({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object[]');
    });
    test('should render tuple as list', () => {
      const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
      const options: JavaOptions = {
        ...JavaGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = JavaDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options,
        dependencyManager: new JavaDependencyManager(options)
      });
      expect(type).toEqual('List<Object>');
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
      const options: JavaOptions = {
        ...JavaGenerator.defaultOptions,
        collectionType: 'Array'
      };
      const type = JavaDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: new JavaDependencyManager(options)
      });
      expect(type).toEqual('String[]');
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
      const options: JavaOptions = {
        ...JavaGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = JavaDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: new JavaDependencyManager(options)
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
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('String');
    });
    test('should render boolean enum values as boolean type', () => {
      const enumValue = new ConstrainedEnumValueModel('test', true, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('boolean');
    });
    test('should render generic number enum value with format', () => {
      const enumValue = new ConstrainedEnumValueModel('test', 123, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
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
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('float');
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
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('double');
    });
    test('should render object enum value as generic Object', () => {
      const enumValue = new ConstrainedEnumValueModel('test', {}, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object');
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
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object');
    });
    test('should render double and integer as double type', () => {
      const enumValue2 = new ConstrainedEnumValueModel('test', 123, {});
      const enumValue1 = new ConstrainedEnumValueModel('test', 123.12, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue1,
        enumValue2
      ]);
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('double');
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
      const type = JavaDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('long');
    });
  });

  describe('Union', () => {
    test('should render the constrained name for ConstrainedObjectModel type unions', () => {
      const union = new ConstrainedObjectModel(
        'test-union',
        undefined,
        {},
        'UnionType',
        {}
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        union
      ]);
      const type = JavaDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('test');
    });
    test('should render the constrained name for referenced ConstrainedObjectModel type unions', () => {
      const union = new ConstrainedObjectModel(
        'test-union',
        undefined,
        {},
        'UnionType',
        {}
      );
      const unionRef = new ConstrainedReferenceModel(
        'test-union-ref',
        undefined,
        {},
        'UnionRefType',
        union
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionRef
      ]);
      const type = JavaDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('test');
    });
    test('should render Object for non ConstrainedObjectModel type unions', () => {
      const union = new ConstrainedAnyModel('test-union', undefined, {}, 'int');
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        union
      ]);
      const type = JavaDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object');
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
      const type = JavaDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Map<String, String>');
    });
    test('should not render simple integer type', () => {
      const keyModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const valueModel = new ConstrainedIntegerModel(
        'test',
        undefined,
        {},
        'int'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = JavaDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Map<String, Integer>');
    });
  });
});
