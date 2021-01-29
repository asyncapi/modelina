import {CommonModel} from '../../src/models/CommonModel'; 
describe('CommonModel', function() {
  describe('$id', function() {
    test('should return a string', function() {
      const doc: any = { $id: 'test' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.$id).not.toBeUndefined();
      expect(typeof d.$id).toEqual('string');
      expect(d.$id).toEqual(doc.$id);
    });
  });

  describe('enum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'string', enum: ['test'] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.enum).not.toBeUndefined();
      expect(Array.isArray(d.enum)).toEqual(true);
      expect(d.enum).toEqual(doc.enum);
    });
  });

  describe('type', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.type).not.toBeUndefined();
      expect(typeof d.type).toEqual('string');
      expect(d.type).toEqual(doc.type);
    });
    
    test('should return an array of strings', function() {
      const doc: any = { type: ['number', 'string'] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.type).not.toBeUndefined();
      expect(Array.isArray(d.type)).toEqual(true);
      expect(d.type).toEqual(doc.type);
    });
  });

  describe('items', function() {
    it('should return a CommonModel object', function() {
      const doc: any = { items: { type: 'string' } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.items).not.toBeUndefined();
      expect(d.items!.constructor.name).toEqual('CommonModel');
      expect(d.items).toEqual(doc.items);
    });
    
    test('should return an array of CommonModel objects', function() {
      const doc: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.items).not.toBeUndefined();
      expect(Array.isArray(d.items)).toEqual(true);
      (<CommonModel[]>d.items).forEach((s, i) => {
        expect(s.constructor.name).toEqual('CommonModel');
        expect(s).toEqual(doc.items[i]);
      });
    });
  });

  describe('properties', function() {
    test('should return a map of CommonModel objects', function() {
      const doc: any = { properties: { test: { type: 'string' } } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.properties).not.toBeUndefined();
      expect(typeof d.properties).toEqual('object');
      Object.keys(d.properties!).forEach(key => {
        const s = d.properties![key];
        expect(s.constructor.name).toEqual('CommonModel');
        expect(s).toEqual(doc.properties[key]);
      });
    });
  });

  describe('additionalProperties', function() {
    test('should return a CommonModel object', function() {
      const doc: any = { additionalProperties: { type: 'string' } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).not.toBeUndefined();
      expect(d.additionalProperties!.constructor.name).toEqual('CommonModel');
      expect(d.additionalProperties!).toEqual(doc.additionalProperties);
    });
    
    test('should return a boolean', function() {
      const doc: any = { additionalProperties: true };
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).not.toBeUndefined();
      expect(typeof d.additionalProperties).toEqual('boolean');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });
    
    test('should return undefined when not defined', function() {
      const doc: any = {};
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).toEqual(undefined);
    });
    
    test('should return undefined when null', function() {
      const doc: any = { additionalProperties: null };
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).not.toBeUndefined();
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });
  });

  describe('$ref', function() {
    test('should return a string ', function() {
      const doc: any = { $ref: 'some/reference' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.$ref).not.toBeUndefined();
      expect(typeof d.$ref).toEqual('string');
      expect(d.$ref).toEqual(doc.$ref);
    });
  });
  describe('extend', function() {
    test('should return a string ', function() {
      const doc: any = { "extend": 'reference' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.extend).not.toBeUndefined();
      expect(typeof d.extend).toEqual('string');
      expect(d.extend).toEqual(doc.extend);
    });
  });
  describe('originalSchema', function() {
    test('should return a schema', function() {
      const doc: any = { "originalSchema": { "type": "string", "minLength": 2 } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.originalSchema).not.toBeUndefined();
      expect(d.originalSchema!.constructor.name).toEqual('Schema');
      expect(d.originalSchema).toEqual(doc.originalSchema);
    });
  });
  describe('toCommonModel', function() {
    test('should never return the same instance of properties', function() {
      const doc: any = { type: 'string', properties: {test: {type:"string"}} };
      const d = CommonModel.toCommonModel(doc);
      const d2 = CommonModel.toCommonModel(d);
      d.properties!["test"].$id = "test";
      expect(d.properties!["test"].$id).toEqual("test");
      expect(d2.properties!["test"].$id).not.toEqual("test");
    });
    test('should never return the same instance of items', function() {
      const doc: any = { type: 'string', items: [{type:"string"}] };
      const d = CommonModel.toCommonModel(doc);
      const d2 = CommonModel.toCommonModel(d);
      const d_items : CommonModel[] = d.items as CommonModel[];
      const d2_items : CommonModel[] = d2.items as CommonModel[];
      d_items[0].$id = "test";
      expect(d_items[0].$id).toEqual("test");
      expect(d2_items[0].$id).not.toEqual("test");
    });
  });
});
