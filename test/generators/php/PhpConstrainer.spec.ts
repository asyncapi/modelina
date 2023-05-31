import { PhpDefaultTypeMapping } from '../../../src/generators/php/PhpConstrainer';
import { PhpGenerator } from '../../../src/generators/php';
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
import { PhpDependencyManager } from '../../../src/generators/php/PhpDependencyManager';

describe('PhpConstrainer', () => {
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = PhpDefaultTypeMapping.Object({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => {
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel(
        'test',
        undefined,
        '',
        refModel
      );
      const type = PhpDefaultTypeMapping.Reference({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = PhpDefaultTypeMapping.Any({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = PhpDefaultTypeMapping.Float({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = PhpDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('int');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = PhpDefaultTypeMapping.String({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = PhpDefaultTypeMapping.Boolean({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        'String'
      );
      const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [
        tupleValueModel
      ]);
      const type = PhpDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
    test('should render multiple tuple types', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        'String'
      );
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, stringModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [
        tupleValueModel0,
        tupleValueModel1
      ]);
      const type = PhpDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        'String'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        '',
        arrayModel
      );
      const type = PhpDefaultTypeMapping.Array({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('array');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('Test', undefined, '', []);
      const type = PhpDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const unionModel = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedUnionModel('test', undefined, '', [
        unionModel
      ]);
      const type = PhpDefaultTypeMapping.Union({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
    test('should render multiple types', () => {
      const unionModel1 = new ConstrainedStringModel('test', undefined, 'str');
      const unionModel2 = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedUnionModel('test', undefined, '', [
        unionModel1,
        unionModel2
      ]);
      const type = PhpDefaultTypeMapping.Union({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'str');
      const valueModel = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        '',
        keyModel,
        valueModel
      );
      const type = PhpDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        options: PhpGenerator.defaultOptions,
        dependencyManager: new PhpDependencyManager(PhpGenerator.defaultOptions)
      });
      expect(type).toEqual('mixed');
    });
  });
});
