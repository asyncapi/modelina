import {JavaDefaultTypeMapping } from '../../../src/generators/java/JavaConstrainer';
import { ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel, JavaGenerator, JavaOptions } from '../../../src';
describe('JavaConstrainer', () => {
  describe('ObjectModel', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, '', {});
      const type = JavaDefaultTypeMapping.Object({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => { 
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, '');
      const model = new ConstrainedReferenceModel('test', undefined, '', refModel);
      const type = JavaDefaultTypeMapping.Reference({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => { 
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, '');
      const type = JavaDefaultTypeMapping.Any({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Object');
    });
  });
  describe('Float', () => { 
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, '');
      const type = JavaDefaultTypeMapping.Float({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('double');
    });
    test('should render double when original input has number format', () => {
      const model = new ConstrainedFloatModel('test', {format: 'float'}, '');
      const type = JavaDefaultTypeMapping.Float({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('float');
    });
  });
  describe('Integer', () => { 
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, '');
      const type = JavaDefaultTypeMapping.Integer({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Integer');
    });
    test('should render int when original input has integer format', () => {
      const model = new ConstrainedIntegerModel('test', {format: 'integer'}, '');
      const type = JavaDefaultTypeMapping.Integer({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('int');
    });
    test('should render int when original input has int32 format', () => {
      const model = new ConstrainedIntegerModel('test', {format: 'int32'}, '');
      const type = JavaDefaultTypeMapping.Integer({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('int');
    });
    test('should render long when original input has long format', () => {
      const model = new ConstrainedIntegerModel('test', {format: 'long'}, '');
      const type = JavaDefaultTypeMapping.Integer({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('long');
    });
    test('should render long when original input has int64 format', () => {
      const model = new ConstrainedIntegerModel('test', {format: 'int64'}, '');
      const type = JavaDefaultTypeMapping.Integer({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('long');
    });
  });
  describe('String', () => { 
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('String');
    });
    test('should render LocalDate when original input has date format', () => {
      const model = new ConstrainedStringModel('test', {format: 'date'}, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('java.time.LocalDate');
    });
    test('should render OffsetTime when original input has time format', () => {
      const model = new ConstrainedStringModel('test', {format: 'time'}, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('java.time.OffsetTime');
    });
    test('should render OffsetDateTime when original input has dateTime format', () => {
      const model = new ConstrainedStringModel('test', {format: 'dateTime'}, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('java.time.OffsetDateTime');
    });
    test('should render OffsetDateTime when original input has date-time format', () => {
      const model = new ConstrainedStringModel('test', {format: 'date-time'}, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('java.time.OffsetDateTime');
    });
    test('should render byte when original input has binary format', () => {
      const model = new ConstrainedStringModel('test', {format: 'binary'}, '');
      const type = JavaDefaultTypeMapping.String({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('byte[]');
    });
  });
  describe('Boolean', () => { 
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, '');
      const type = JavaDefaultTypeMapping.Boolean({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Boolean');
    });
  });

  describe('Tuple', () => { 
    test('should render type', () => {
      const model = new ConstrainedTupleModel('test', undefined, '', []);
      const type = JavaDefaultTypeMapping.Tuple({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Object[]');
    });
    test('should render tuple as list', () => {
      const model = new ConstrainedTupleModel('test', undefined, '', []);
      const options: JavaOptions = {...JavaGenerator.defaultOptions, collectionType: 'List'};
      const type = JavaDefaultTypeMapping.Tuple({constrainedModel: model, options});
      expect(type).toEqual('List<Object>');
    });
  });

  describe('Array', () => { 
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const options: JavaOptions = {...JavaGenerator.defaultOptions, collectionType: 'Array'};
      const type = JavaDefaultTypeMapping.Array({constrainedModel: model, options});
      expect(type).toEqual('String[]');
    });
    test('should render array as a list', () => {
      const arrayModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedArrayModel('test', undefined, '', arrayModel);
      const options: JavaOptions = {...JavaGenerator.defaultOptions, collectionType: 'List'};
      const type = JavaDefaultTypeMapping.Array({constrainedModel: model, options});
      expect(type).toEqual('List<String>');
    });
  });

  describe('Enum', () => { 
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('test', undefined, '', []);
      const type = JavaDefaultTypeMapping.Enum({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => { 
    test('should render type', () => {
      const model = new ConstrainedUnionModel('test', undefined, '', []);
      const type = JavaDefaultTypeMapping.Union({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Object');
    });
  });

  describe('Dictionary', () => { 
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel('test', undefined, 'String');
      const valueModel = new ConstrainedStringModel('test', undefined, 'String');
      const model = new ConstrainedDictionaryModel('test', undefined, '', keyModel, valueModel);
      const type = JavaDefaultTypeMapping.Dictionary({constrainedModel: model, options: JavaGenerator.defaultOptions});
      expect(type).toEqual('Map<String, String>');
    });
  });
});
