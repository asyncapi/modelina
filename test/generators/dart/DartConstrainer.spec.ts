import { DartGenerator, DartOptions } from '../../../src/generators';
import { DartDefaultTypeMapping } from '../../../src/generators/dart/DartConstrainer';
import { DartDependencyManager } from '../../../src/generators/dart/DartDependencyManager';
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
  ConstrainedUnionModel
} from '../../../src/models';

describe('DartConstrainer', () => {
  const defaultOptions = {
    options: DartGenerator.defaultOptions,
    dependencyManager: new DartDependencyManager(DartGenerator.defaultOptions)
  };
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = DartDefaultTypeMapping.Object({
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
      const type = DartDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = DartDefaultTypeMapping.Any({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Object');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = DartDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('double');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = DartDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = DartDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('String');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = DartDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render default type', () => {
      const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
      const optionsToUse: DartOptions = { ...DartGenerator.defaultOptions };
      const type = DartDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: optionsToUse,
        dependencyManager: new DartDependencyManager(optionsToUse)
      });
      expect(type).toEqual('List<Object>');
    });
    test('should render type with custom collection type', () => {
      const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
      const optionsToUse: DartOptions = {
        ...DartGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = DartDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: optionsToUse,
        dependencyManager: new DartDependencyManager(optionsToUse)
      });
      expect(type).toEqual('List<Object>');
    });
  });

  describe('Array', () => {
    test('should render default type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'string'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const type = DartDefaultTypeMapping.Array({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('List<string>');
    });
    test('should render type with custom collection type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'string'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const optionsToUse: DartOptions = {
        ...DartGenerator.defaultOptions,
        collectionType: 'List'
      };
      const type = DartDefaultTypeMapping.Array({
        constrainedModel: model,
        options: optionsToUse,
        dependencyManager: new DartDependencyManager(optionsToUse)
      });
      expect(type).toEqual('List<string>');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, {}, '', []);
      const type = DartDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, {}, '', []);
      const type = DartDefaultTypeMapping.Union({
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
        'string'
      );
      const valueModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'string'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = DartDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Map<string, string>');
    });
  });
});
