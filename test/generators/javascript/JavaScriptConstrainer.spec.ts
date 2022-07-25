import {JavaScriptDefaultTypeMapping } from '../../../src/generators/javascript/JavaScriptConstrainer';
import {MockJavaScriptRenderer} from '../../TestUtils/TestRenderers';
import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { CommonModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel, JavaScriptGenerator } from '../../../src';
describe('JavaScriptConstrainer', () => {
  describe('ObjectModel', () => { 
    test('should have no type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = JavaScriptDefaultTypeMapping.Object({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('Reference', () => { 
    test('should have no type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = JavaScriptDefaultTypeMapping.Reference({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('Any', () => { 
    test('should have no type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = JavaScriptDefaultTypeMapping.Any({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('Float', () => { 
    test('should have no type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = JavaScriptDefaultTypeMapping.Float({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('Integer', () => { 
    test('should have no type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = JavaScriptDefaultTypeMapping.Integer({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('String', () => { 
    test('should have no type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = JavaScriptDefaultTypeMapping.String({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
  describe('Boolean', () => { 
    test('should have no type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = JavaScriptDefaultTypeMapping.Boolean({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });

  describe('Tuple', () => { 
    test('should have no type', () => {
      const model = new ConstrainedTupleModel('test', undefined, '', []);
      const type = JavaScriptDefaultTypeMapping.Tuple({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });

  describe('Array', () => { 
    test('should have no type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const type = JavaScriptDefaultTypeMapping.Array({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });

  describe('Enum', () => { 
    test('should have no type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = JavaScriptDefaultTypeMapping.Enum({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });

  describe('Union', () => { 
    test('should have no type', () => {
      const model = new ConstrainedUnionModel('test', undefined, '', []);
      const type = JavaScriptDefaultTypeMapping.Union({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });

  describe('Dictionary', () => { 
    test('should have no type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'String');
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = JavaScriptDefaultTypeMapping.Dictionary({constrainedModel: model, options: JavaScriptGenerator.defaultOptions});
      expect(type).toEqual('');
    });
  });
});
