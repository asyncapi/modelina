import {GoDefaultTypeMapping } from '../../../src/generators/go/GoConstrainer';
import {MockGoRenderer} from '../../TestUtils/TestRenderers';
import { GoRenderer } from '../../../src/generators/go/GoRenderer';
import { CommonInputModel, CommonModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel, GoGenerator } from '../../../src';
describe('GoConstrainer', () => {
  let renderer: GoRenderer;
  beforeEach(() => {
    renderer = new MockGoRenderer(GoGenerator.defaultOptions, new GoGenerator(), [], new CommonModel(), new CommonInputModel());
  });
  describe('ObjectModel', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = GoDefaultTypeMapping.Object({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => { 
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = GoDefaultTypeMapping.Reference({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => { 
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = GoDefaultTypeMapping.Any({constrainedModel: model, renderer});
      expect(type).toEqual('interface{}');
    });
  });
  describe('Float', () => { 
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = GoDefaultTypeMapping.Float({constrainedModel: model, renderer});
      expect(type).toEqual('float64');
    });
  });
  describe('Integer', () => { 
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = GoDefaultTypeMapping.Integer({constrainedModel: model, renderer});
      expect(type).toEqual('int');
    });
  });
  describe('String', () => { 
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = GoDefaultTypeMapping.String({constrainedModel: model, renderer});
      expect(type).toEqual('string');
    });
  });
  describe('Boolean', () => { 
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = GoDefaultTypeMapping.Boolean({constrainedModel: model, renderer});
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => { 
    test('should render type', () => {
      const model = new ConstrainedTupleModel('test', undefined, '', []);
      const type = GoDefaultTypeMapping.Tuple({constrainedModel: model, renderer});
      expect(type).toEqual('[]interface{}');
    });
  });

  describe('Array', () => { 
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'string');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const type = GoDefaultTypeMapping.Array({constrainedModel: model, renderer});
      expect(type).toEqual('[]string');
    });
  });

  describe('Enum', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = GoDefaultTypeMapping.Enum({constrainedModel: model, renderer});
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => { 
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, '', []);
      const type = GoDefaultTypeMapping.Union({constrainedModel: model, renderer});
      expect(type).toEqual('interface{}');
    });
  });

  describe('Dictionary', () => { 
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'string');
      const valueModel = new ConstrainedStringModel('test', undefined, 'string');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = GoDefaultTypeMapping.Dictionary({constrainedModel: model, renderer});
      expect(type).toEqual('map[string]string');
    });
  });
});
