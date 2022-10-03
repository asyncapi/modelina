import { PythonDefaultTypeMapping } from '../../../src/generators/python/PythonConstrainer';
import { PythonGenerator } from '../../../src/generators/python';
import { ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedUnionModel } from '../../../src';
describe('PythonConstrainer', () => {
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = PythonDefaultTypeMapping.Object({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => {
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = PythonDefaultTypeMapping.Reference({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = PythonDefaultTypeMapping.Any({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('Any');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = PythonDefaultTypeMapping.Float({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = PythonDefaultTypeMapping.Integer({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('int');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = PythonDefaultTypeMapping.String({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('str');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = PythonDefaultTypeMapping.Boolean({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const stringModel = new ConstrainedStringModel('test', undefined, 'str');
      const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel]);
      const type = PythonDefaultTypeMapping.Tuple({constrainedModel: model, options: PythonGenerator.defaultOptions});
      expect(type).toEqual('tuple[str]');
    });
    test('should render multiple tuple types', () => {
      const stringModel = new ConstrainedStringModel('test', undefined, 'str');
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, stringModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel0, tupleValueModel1]);
      const type = PythonDefaultTypeMapping.Tuple({constrainedModel: model, options: PythonGenerator.defaultOptions});
      expect(type).toEqual('tuple[str, str]');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const type = PythonDefaultTypeMapping.Array({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('list[str]');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('Test', undefined, '', []);
      const type = PythonDefaultTypeMapping.Enum({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const unionModel = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedUnionModel('test', undefined, '', [unionModel]);
      const type = PythonDefaultTypeMapping.Union({constrainedModel: model, options: PythonGenerator.defaultOptions});
      expect(type).toEqual('str');
    });
    test('should render multiple types', () => {
      const unionModel1 = new ConstrainedStringModel('test', undefined, 'str');
      const unionModel2 = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedUnionModel('test', undefined, '', [unionModel1, unionModel2]);
      const type = PythonDefaultTypeMapping.Union({constrainedModel: model, options: PythonGenerator.defaultOptions});
      expect(type).toEqual('str | str');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'str');
      const valueModel = new ConstrainedStringModel('test', undefined, 'str');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = PythonDefaultTypeMapping.Dictionary({ constrainedModel: model, options: PythonGenerator.defaultOptions });
      expect(type).toEqual('dict[str, str]');
    });
  });
});
