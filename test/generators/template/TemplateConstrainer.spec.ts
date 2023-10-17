import { TemplateDefaultTypeMapping } from '../../../src/generators/template/TemplateConstrainer';
import { TemplateGenerator } from '../../../src/generators/template';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedTupleValueModel,
  ConstrainedUnionModel
} from '../../../src';
describe('TemplateConstrainer', () => {
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = TemplateDefaultTypeMapping.Object({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
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
      const type = TemplateDefaultTypeMapping.Reference({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = TemplateDefaultTypeMapping.Any({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = TemplateDefaultTypeMapping.Float({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = TemplateDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = TemplateDefaultTypeMapping.String({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = TemplateDefaultTypeMapping.Boolean({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
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
      const type = TemplateDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
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
      const type = TemplateDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
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
      const type = TemplateDefaultTypeMapping.Array({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('Test', undefined, {}, '', []);
      const type = TemplateDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual(model.name);
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
      const type = TemplateDefaultTypeMapping.Union({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
    test('should render multiple types', () => {
      const unionModel1 = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'str'
      );
      const unionModel2 = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'str'
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionModel1,
        unionModel2
      ]);
      const type = TemplateDefaultTypeMapping.Union({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, {}, 'str');
      const valueModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'str'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = TemplateDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        options: TemplateGenerator.defaultOptions,
        dependencyManager: undefined as never
      });
      expect(type).toEqual('');
    });
  });
});
