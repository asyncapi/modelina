import { CSharpDefaultTypeMapping } from '../../../src/generators/csharp/CSharpConstrainer';
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
  ConstrainedUnionModel,
  CSharpGenerator,
  CSharpOptions
} from '../../../src';
import { CSharpDependencyManager } from '../../../src/generators/csharp/CSharpDependencyManager';

describe('CSharpConstrainer', () => {
  const dependencyManagerInstance = new CSharpDependencyManager(
    CSharpGenerator.defaultOptions
  );
  const defaultOptions = {
    options: CSharpGenerator.defaultOptions,
    dependencyManager: dependencyManagerInstance
  };
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = CSharpDefaultTypeMapping.Object({
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
      const type = CSharpDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = CSharpDefaultTypeMapping.Any({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('dynamic');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = CSharpDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('double');
    });
  });
  describe('Integer', () => {
    test('should render int', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = CSharpDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
    test('should render long', () => {
      const model = new ConstrainedIntegerModel('test', undefined, { format: 'int64' }, '');
      const type = CSharpDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('long');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = CSharpDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('string');
    });
    test('should render System.DateTime', () => {
      const model = new ConstrainedStringModel(
        'test',
        undefined,
        { format: 'date' },
        ''
      );
      const type = CSharpDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('System.DateTime');
    });
    test('should render System.DateTimeOffset', () => {
      const model = new ConstrainedStringModel(
        'test',
        undefined,
        { format: 'date-time' },
        ''
      );
      const type = CSharpDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('System.DateTimeOffset');
    });
    test('should render TimeSpan', () => {
      const model = new ConstrainedStringModel(
        'test',
        undefined,
        { format: 'time' },
        ''
      );
      const type = CSharpDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('System.TimeSpan');
    });
    test('should render Guid', () => {
      const model = new ConstrainedStringModel(
        'test',
        undefined,
        { format: 'uuid' },
        ''
      );
      const type = CSharpDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('System.Guid');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = CSharpDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const tupleModel = new ConstrainedBooleanModel(
        'test',
        undefined,
        {},
        'string'
      );
      const tupleValueModel = new ConstrainedTupleValueModel(0, tupleModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel
      ]);
      const type = CSharpDefaultTypeMapping.Tuple({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('(string)');
    });
    test('should render multiple types', () => {
      const tupleModel = new ConstrainedBooleanModel(
        'test',
        undefined,
        {},
        'string'
      );
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, tupleModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, tupleModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel0,
        tupleValueModel1
      ]);
      const type = CSharpDefaultTypeMapping.Tuple({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('(string, string)');
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
      const options: CSharpOptions = {
        ...CSharpGenerator.defaultOptions,
        collectionType: 'Array'
      };
      const type = CSharpDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: dependencyManagerInstance
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
      const options: CSharpOptions = {
        ...CSharpGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = CSharpDefaultTypeMapping.Array({
        constrainedModel: model,
        options,
        dependencyManager: dependencyManagerInstance
      });
      expect(type).toEqual('IEnumerable<String>');
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
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('string');
    });
    test('should render boolean enum values as boolean type', () => {
      const enumValue = new ConstrainedEnumValueModel('test', true, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
    test('should render generic number enum value with format', () => {
      const enumValue = new ConstrainedEnumValueModel('test', 123, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
    test('should render object enum value as generic Object', () => {
      const enumValue = new ConstrainedEnumValueModel('test', {}, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue
      ]);
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('dynamic');
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
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('dynamic');
    });
    test('should render double and integer as dynamic type', () => {
      const enumValue2 = new ConstrainedEnumValueModel('test', 123, {});
      const enumValue1 = new ConstrainedEnumValueModel('test', 123.12, {});
      const model = new ConstrainedEnumModel('test', undefined, {}, '', [
        enumValue1,
        enumValue2
      ]);
      const type = CSharpDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('dynamic');
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, {}, '', []);
      const type = CSharpDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('dynamic');
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
      const type = CSharpDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Dictionary<String, String>');
    });
  });
});
