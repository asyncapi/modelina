import { CSharpDefaultTypeMapping } from '../../../src/generators/csharp/CSharpConstrainer';
import { MockCSharpRenderer } from '../../TestUtils/TestRenderers';
import { CSharpRenderer } from '../../../src/generators/csharp/CSharpRenderer';
import { CommonInputModel, CommonModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedUnionModel, CSharpGenerator } from '../../../src';
describe('CSharpConstrainer', () => {
  let renderer: CSharpRenderer;
  beforeEach(() => {
    renderer = new MockCSharpRenderer(CSharpGenerator.defaultOptions, new CSharpGenerator(), [], new CommonModel(), new CommonInputModel());
  });
  describe('ObjectModel', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = CSharpDefaultTypeMapping.Object({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => { 
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = CSharpDefaultTypeMapping.Reference({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => { 
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Any({constrainedModel: model, renderer});
      expect(type).toEqual('dynamic');
    });
  });
  describe('Float', () => { 
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Float({constrainedModel: model, renderer});
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => { 
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Integer({constrainedModel: model, renderer});
      expect(type).toEqual('int');
    });
  });
  describe('String', () => { 
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.String({constrainedModel: model, renderer});
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => { 
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = CSharpDefaultTypeMapping.Boolean({constrainedModel: model, renderer});
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => { 
    test('should render type', () => {
      const tupleModel = new ConstrainedBooleanModel('test', undefined, 'string');
      const tupleValueModel = new ConstrainedTupleValueModel(0, tupleModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel]);
      const type = CSharpDefaultTypeMapping.Tuple({constrainedModel: model, renderer});
      expect(type).toEqual('(string)');
    });
  });

  describe('Array', () => { 
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      renderer.options.collectionType = 'Array';
      const type = CSharpDefaultTypeMapping.Array({constrainedModel: model, renderer});
      expect(type).toEqual('String[]');
    });
  });

  describe('Enum', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = CSharpDefaultTypeMapping.Enum({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => { 
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, '', []);
      const type = CSharpDefaultTypeMapping.Union({constrainedModel: model, renderer});
      expect(type).toEqual('dynamic');
    });
  });

  describe('Dictionary', () => { 
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'String');
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = CSharpDefaultTypeMapping.Dictionary({constrainedModel: model, renderer});
      expect(type).toEqual('Dictionary<String, String>');
    });
  });
});
