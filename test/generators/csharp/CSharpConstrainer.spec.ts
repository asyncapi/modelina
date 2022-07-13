import { CSharpDefaultTypeMapping } from '../../../src/generators/csharp/CSharpConstrainer';
import { ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedUnionModel, CSharpGenerator, CSharpOptions } from '../../../src';
describe('CSharpConstrainer', () => {
  describe('ObjectModel', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = CSharpDefaultTypeMapping.Object({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => { 
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = CSharpDefaultTypeMapping.Reference({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => { 
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Any({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('dynamic');
    });
  });
  describe('Float', () => { 
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Float({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => { 
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Integer({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('int');
    });
  });
  describe('String', () => { 
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.String({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => { 
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Boolean({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => { 
    test('should render type', () => {
      const tupleModel = new ConstrainedBooleanModel('test', undefined, 'string');
      const tupleValueModel = new ConstrainedTupleValueModel(0, tupleModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel]);
      const type = CSharpDefaultTypeMapping.Tuple({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('(string)');
    });
    test('should render multiple types', () => {
      const tupleModel = new ConstrainedBooleanModel('test', undefined, 'string');
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, tupleModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, tupleModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel0, tupleValueModel1]);
      const type = CSharpDefaultTypeMapping.Tuple({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('(string, string)');
    });
  });

  describe('Array', () => { 
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const options: CSharpOptions = {...CSharpGenerator.defaultOptions, collectionType: 'Array'};
      const type = CSharpDefaultTypeMapping.Array({constrainedModel: model, options});
      expect(type).toEqual('String[]');
    });
    test('should render array as a list', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const options: CSharpOptions = {...CSharpGenerator.defaultOptions, collectionType: 'List'};
      const type = CSharpDefaultTypeMapping.Array({constrainedModel: model, options});
      expect(type).toEqual('IEnumerable<String>');
    });
  });

  describe('Enum', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = CSharpDefaultTypeMapping.Enum({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => { 
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, '', []);
      const type = CSharpDefaultTypeMapping.Union({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('dynamic');
    });
  });

  describe('Dictionary', () => { 
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'String');
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = CSharpDefaultTypeMapping.Dictionary({constrainedModel: model, options: CSharpGenerator.defaultOptions});
      expect(type).toEqual('Dictionary<String, String>');
    });
  });
});
