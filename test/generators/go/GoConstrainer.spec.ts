import { GoDefaultTypeMapping } from '../../../src/generators/go/GoConstrainer';
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
  ConstrainedUnionModel,
  GoGenerator
} from '../../../src';
import { GoDependencyManager } from '../../../src/generators/go/GoDependencyManager';
describe('GoConstrainer', () => {
  const defaultOptions = {
    options: GoGenerator.defaultOptions,
    dependencyManager: new GoDependencyManager(GoGenerator.defaultOptions)
  };
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = GoDefaultTypeMapping.Object({
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
      const type = GoDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Any({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('interface{}');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('float64');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
      const type = GoDefaultTypeMapping.Tuple({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('[]interface{}');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
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
      const type = GoDefaultTypeMapping.Array({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('[]string');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, {}, '', []);
      const type = GoDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, {}, '', []);
      const type = GoDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('test');
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
      const type = GoDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('map[string]string');
    });
  });
});

describe('nullable & requried', () => {
  const defaultOptions = {
    options: GoGenerator.defaultOptions,
    dependencyManager: new GoDependencyManager(GoGenerator.defaultOptions)
  };
  describe('String', () => {
    test('nullable', () => {
      const model = new ConstrainedStringModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = GoDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('*string');
    });

    test('not nullable', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('string');
    });
  });

  describe('int', () => {
    test('nullable', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = GoDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('*int');
    });

    test('not nullable', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('int');
    });
  });

  describe('Float64', () => {
    test('nullable', () => {
      const model = new ConstrainedFloatModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = GoDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('*float64');
    });

    test('not nullable', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('float64');
    });
  });
  describe('Bool', () => {
    test('nullable', () => {
      const model = new ConstrainedBooleanModel(
        'test',
        undefined,
        { isNullable: true },
        ''
      );
      const type = GoDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('*bool');
    });

    test('not nullable', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = GoDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
  });
});
