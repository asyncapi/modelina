import { CplusplusDefaultTypeMapping } from '../../../src/generators/cplusplus/CplusplusConstrainer';
import { CplusplusGenerator } from '../../../src/generators/cplusplus';
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
import { CplusplusDependencyManager } from '../../../src/generators/cplusplus/CplusplusDependencyManager';
const dependencyFactory = () => {
  return new CplusplusDependencyManager(CplusplusGenerator.defaultOptions, []);
};
describe('CplusplusConstrainer', () => {
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = CplusplusDefaultTypeMapping.Object({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual(`AsyncapiModels::${model.name}`);
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
      const type = CplusplusDefaultTypeMapping.Reference({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual(`AsyncapiModels::${model.name}`);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = CplusplusDefaultTypeMapping.Any({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::any');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = CplusplusDefaultTypeMapping.Float({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('double');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = CplusplusDefaultTypeMapping.Integer({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('int');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = CplusplusDefaultTypeMapping.String({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::string');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = CplusplusDefaultTypeMapping.Boolean({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel
      ]);
      const type = CplusplusDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::tuple<std::string>');
    });
    test('should render multiple tuple types', () => {
      const stringModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, stringModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, {}, '', [
        tupleValueModel0,
        tupleValueModel1
      ]);
      const type = CplusplusDefaultTypeMapping.Tuple({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::tuple<std::string, std::string>');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const type = CplusplusDefaultTypeMapping.Array({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::vector<std::string>');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('Test', undefined, {}, '', []);
      const type = CplusplusDefaultTypeMapping.Enum({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual(`AsyncapiModels::${model.name}`);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const unionModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionModel
      ]);
      const type = CplusplusDefaultTypeMapping.Union({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::variant<std::string>');
    });
    test('should render multiple types', () => {
      const unionModel1 = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const unionModel2 = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionModel1,
        unionModel2
      ]);
      const type = CplusplusDefaultTypeMapping.Union({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::variant<std::string, std::string>');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const valueModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'std::string'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = CplusplusDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        options: CplusplusGenerator.defaultOptions,
        dependencyManager: dependencyFactory()
      });
      expect(type).toEqual('std::map<std::string, std::string>');
    });
  });
});
