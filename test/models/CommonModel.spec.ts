import {CommonModel} from '../../src/models/CommonModel'; 
import { Schema } from '../../src/models/Schema';
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
      (d.items as CommonModel[]).forEach((s, i) => {
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
  describe('mergeCommonModels', function() {
    describe('$id', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toEqual(doc2.$id);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1.$id = "temp";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toEqual(doc2.$id);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toBeUndefined();
      });
    });
    describe('$ref', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$ref = "test";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toEqual(doc2.$ref);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1.$id = "temp";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toEqual(doc2.$ref);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toBeUndefined();
      });
    });
    describe('extend', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.extend = ["test"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toEqual(doc2.extend);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1.$id = "temp";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toEqual(doc2.extend);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toBeUndefined();
      });
    });
    describe('type', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.type = ["string"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.type).toEqual(doc2.type);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.type = ["string"];
        doc1.type = ["number"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.type).toEqual(["number", "string"]);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toBeUndefined();
      });
    });
    describe('enum', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ["string"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(doc2.enum);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ["string"];
        doc1.enum = ["number"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(["number", "string"]);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toBeUndefined();
      });
    });
    describe('items', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [{type: "string"}];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual(doc2.items[0]);
      });
      test('should be merged when only left side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.items = [{type: "string"}, {type: "number"}];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual({type: ["string", "number"], originalSchema: {}});
      });
      test('should handle empty items', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.items = [];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toBeUndefined();
      });
      test('should be merged when both sides are defined as schemas', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.items = {type: "string"};
        doc1.items = {type: "number"};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual({type: ["number", "string"], originalSchema: {}});
      });
      test('should be merged when both sides are defined as array of schemas with different lengths', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [{type: "string"}, {type: ["boolean"]}];
        doc1.items = [{type: ["number"]}];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual({"originalSchema": {}, "type": ["number", "string", "boolean"]});
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toBeUndefined();
      });
    });

    describe('properties', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {"testProp": {type: "string"}};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual(doc2.properties);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {"testProp": {type: "string"}};
        doc1.properties = {"testProp2": {type: "number"}};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual({"testProp": {type: "string"}, "testProp2": {type: "number"}});
      });
      test('should be merged together when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {"testProp": {type: "string"}};
        doc1.properties = {"testProp": {type: "number"}};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual({"testProp": {type: ["number", "string"], originalSchema: {}}});
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toBeUndefined();
      });
    });
  });
});
