import {TypeScriptDefaultTypeMapping } from '../../../src/generators/typescript/TypeScriptConstrainer';
import {MockTypeScriptRenderer} from '../../TestUtils/TestRenderers';
import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { CommonInputModel, CommonModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedUnionModel, TypeScriptGenerator } from '../../../src';
describe('TypeScriptConstrainer', () => {
  let renderer: TypeScriptRenderer;
  beforeEach(() => {
    renderer = new MockTypeScriptRenderer(TypeScriptGenerator.defaultOptions, new TypeScriptGenerator(), [], new CommonModel(), new CommonInputModel());
  });
  describe('ObjectModel', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = TypeScriptDefaultTypeMapping.Object({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => { 
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = TypeScriptDefaultTypeMapping.Reference({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => { 
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = TypeScriptDefaultTypeMapping.Any({constrainedModel: model, renderer});
      expect(type).toEqual('any');
    });
  });
  describe('Float', () => { 
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = TypeScriptDefaultTypeMapping.Float({constrainedModel: model, renderer});
      expect(type).toEqual('number');
    });
  });
  describe('Integer', () => { 
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = TypeScriptDefaultTypeMapping.Integer({constrainedModel: model, renderer});
      expect(type).toEqual('integer');
    });
  });
  describe('String', () => { 
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = TypeScriptDefaultTypeMapping.String({constrainedModel: model, renderer});
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => { 
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = TypeScriptDefaultTypeMapping.Boolean({constrainedModel: model, renderer});
      expect(type).toEqual('boolean');
    });
  });

  describe('Tuple', () => { 
    test('should render type', () => {
      const stringModel = new ConstrainedStringModel('test', undefined, 'String');
      const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel]);
      const type = TypeScriptDefaultTypeMapping.Tuple({constrainedModel: model, renderer});
      expect(type).toEqual('[String]');
    });
    test('should render multiple tuple types', () => {
      const stringModel = new ConstrainedStringModel('test', undefined, 'String');
      const tupleValueModel0 = new ConstrainedTupleValueModel(0, stringModel);
      const tupleValueModel1 = new ConstrainedTupleValueModel(1, stringModel);
      const model = new ConstrainedTupleModel('test', undefined, '', [tupleValueModel0, tupleValueModel1]);
      const type = TypeScriptDefaultTypeMapping.Tuple({constrainedModel: model, renderer});
      expect(type).toEqual('[String, String]');
    });
  });

  describe('Array', () => { 
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const type = TypeScriptDefaultTypeMapping.Array({constrainedModel: model, renderer});
      expect(type).toEqual('String[]');
    });
  });

  describe('Enum', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = TypeScriptDefaultTypeMapping.Enum({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => { 
    test('should render type', () => {
      const unionModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedUnionModel('test', undefined, '', [unionModel]);
      const type = TypeScriptDefaultTypeMapping.Union({constrainedModel: model, renderer});
      expect(type).toEqual('String');
    });
    test('should render multiple types', () => {
      const unionModel1 = new ConstrainedStringModel('test', undefined, 'String');
      const unionModel2 = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedUnionModel('test', undefined, '', [unionModel1, unionModel2]);
      const type = TypeScriptDefaultTypeMapping.Union({constrainedModel: model, renderer});
      expect(type).toEqual('String | String');
    });
  });

  describe('Dictionary', () => { 
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'String');
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = TypeScriptDefaultTypeMapping.Dictionary({constrainedModel: model, renderer});
      expect(type).toEqual('{ [name: String]: String }');
    });
    test('should not be able to render dictionary with union key type', () => {
      const keyModel = new ConstrainedUnionModel('test', undefined, 'String', []);
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = TypeScriptDefaultTypeMapping.Dictionary({constrainedModel: model, renderer});
      expect(type).toEqual('{ [name: any]: String }');
    });
  });
});
