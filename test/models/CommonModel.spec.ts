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
    test('should handle recursive models', function() {
      const doc: Schema = { };
      let doc1 = CommonModel.toCommonModel(doc);
      doc1.properties = {
        "recursive": doc1
      }
      let doc2 = CommonModel.toCommonModel(doc);
      doc2.properties = {
        "recursive": doc2
      }
      doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
      expect(doc1.properties).not.toBeUndefined();
      expect(doc1.properties!["recursive"]).not.toBeUndefined();
      expect(doc1.properties!["recursive"]).toEqual(doc1);
    });
    describe('$id', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toEqual(doc2.$id);
      });
      test('should not be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = "test";
        doc1.$id = "temp";
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).not.toEqual(doc2.$id);
        expect(doc1.$id).toEqual("temp");
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toBeUndefined();
      });
    });
    describe('required', function() {
      test('should contain the same if right side is not defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ["test"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(["test"]);
      });
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.required = ["test"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(doc2.required);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ["test"];
        doc2.required = ["test2"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(["test", "test2"]);
      });
      test('should only contain one if duplicate', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ["test"];
        doc2.required = ["test"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(["test"]);
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toBeUndefined();
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
      test('Should not contain duplicate values', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ["string"];
        doc1.enum = ["string"];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(["string"]);
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
        doc2.items = [CommonModel.toCommonModel({type: "string"})];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual(doc2.items[0]);
      });
      test('should be merged when only left side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1.items = [CommonModel.toCommonModel({type: "string"}), CommonModel.toCommonModel({type: "number"})];
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
        doc2.items = CommonModel.toCommonModel({type: "string"});
        doc1.items = CommonModel.toCommonModel({type: "number"});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual({type: ["number", "string"], originalSchema: {}});
      });
      test('should be merged when both sides are defined as array of schemas with different lengths', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [CommonModel.toCommonModel({type: "string"}), CommonModel.toCommonModel({type: "boolean"})];
        doc1.items = [CommonModel.toCommonModel({type: "number"})];
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
        doc2.properties = {"testProp": CommonModel.toCommonModel({type: "string"})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual(doc2.properties);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {"testProp": CommonModel.toCommonModel({type: "string"})};
        doc1.properties = {"testProp2": CommonModel.toCommonModel({type: "number"})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual({"testProp": {type: "string"}, "testProp2": {type: "number"}});
      });
      test('should be merged together when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {"testProp": CommonModel.toCommonModel({type: "string"})};
        doc1.properties = {"testProp": CommonModel.toCommonModel({type: "number"})};
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
    describe('additionalProperties', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalProperties = CommonModel.toCommonModel({type: "string"});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalProperties).toEqual(doc2.additionalProperties);
      });
      test('should be merged together when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalProperties = CommonModel.toCommonModel({type: "string"});
        doc1.additionalProperties = CommonModel.toCommonModel({type: "number"});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalProperties).toEqual({type: ["number", "string"], originalSchema: {}});
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toBeUndefined();
      });
    });

    describe('patternProperties', function() {
      test('should be merged when only right side is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {"pattern1": CommonModel.toCommonModel({type: "string"})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual(doc2.patternProperties);
      });
      test('should be merged when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {"pattern1": CommonModel.toCommonModel({type: "string"})};
        doc1.patternProperties = {"pattern2": CommonModel.toCommonModel({type: "number"})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual({"pattern1": {type: "string"}, "pattern2": {type: "number"}});
      });
      test('should be merged together when both sides are defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {"pattern1": CommonModel.toCommonModel({type: "string"})};
        doc1.patternProperties = {"pattern1": CommonModel.toCommonModel({type: "number"})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual({"pattern1": {type: ["number", "string"], originalSchema: {}}});
      });
      test('should not change if nothing is defined', function() {
        const doc: Schema = { };
        let doc1 = CommonModel.toCommonModel(doc);
        let doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toBeUndefined();
      });
    });
  });
  
  describe('addItem', function() {
    beforeAll(() => {
      jest.spyOn(CommonModel, "mergeCommonModels");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add items to model', function() {
      const itemModel = new CommonModel();
      itemModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addItem(itemModel, {});
      expect(model.items).toEqual(itemModel);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge items together', function() {
      const itemModel = new CommonModel();
      itemModel.$id = "test"; 
      const model = new CommonModel();
      model.items = itemModel;
      model.addItem(itemModel, {});
      model.addItem(itemModel, {});
      expect(model.items).toEqual(itemModel);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, itemModel, itemModel, {});
    });
  });
  describe('addProperty', function() {
    beforeAll(() => {
      jest.spyOn(CommonModel, "mergeCommonModels");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add property to model', function() {
      const propertyModel = new CommonModel();
      propertyModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addProperty("test", propertyModel, {});
      expect(model.properties).toEqual({"test": propertyModel});
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge if already existing property', function() {
      const propertyModel = new CommonModel();
      propertyModel.$id = "test"; 
      const model = new CommonModel(); 
      model.properties = {
        "test": propertyModel
      };
      model.addProperty("test", propertyModel, {});
      expect(model.properties).toEqual({"test": propertyModel});
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, propertyModel, propertyModel, {});
    });
  });
  describe('addExtendedModel', function() {
    test('should extend model', function() {
      const extendedModel = new CommonModel();
      extendedModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      expect(model.extend).toEqual(["test"]);
    });
    test('should ignore model if it has no $id', function() {
      const extendedModel = new CommonModel();
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      expect(model.extend).toBeUndefined();
    });
    test('should ignore duplicate model $id', function() {
      const extendedModel = new CommonModel();
      extendedModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      model.addExtendedModel(extendedModel);
      expect(model.extend).toEqual(["test"]);
    });
  });
  describe('setTypes', function() {
    test('should set multiple types', function() {
      const model = new CommonModel(); 
      model.setType(['type1', 'type2']);
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should set array type as regular type with length 1', function() {
      const model = new CommonModel(); 
      model.setType(['type']);
      expect(model.type).toEqual('type');
    });
    test('should set type undefined with array of length 0', function() {
      const model = new CommonModel(); 
      model.setType([]);
      expect(model.type).toBeUndefined();
    });
    test('should set type as is', function() {
      const model = new CommonModel(); 
      model.setType('type');
      expect(model.type).toEqual('type');
    });
    test('should set type overwriting existing type', function() {
      const model = new CommonModel(); 
      model.type = ['type1'];
      model.setType('type2');
      expect(model.type).toEqual('type2');
    });
    test('should overwrite already sat type', function() {
      const model = new CommonModel(); 
      model.setType('type1');
      model.setType('type2');
      expect(model.type).toEqual('type2');
    });
  });


  describe('addAdditionalProperty', function() {
    beforeAll(() => {
      jest.spyOn(CommonModel, "mergeCommonModels");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add additionalProperties to model', function() {
      const additionalPropertiesModel = new CommonModel();
      additionalPropertiesModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addAdditionalProperty(additionalPropertiesModel, {});
      expect(model.additionalProperties).toEqual(additionalPropertiesModel);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge additionalProperties together', function() {
      const additionalPropertiesModel = new CommonModel();
      additionalPropertiesModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addAdditionalProperty(additionalPropertiesModel, {});
      model.addAdditionalProperty(additionalPropertiesModel, {});
      expect(model.additionalProperties).toEqual(additionalPropertiesModel);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, additionalPropertiesModel, additionalPropertiesModel, {});
    });
  });
  describe('addPatternProperty', function() {
    beforeAll(() => {
      jest.spyOn(CommonModel, "mergeCommonModels");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add patternProperty to model', function() {
      const patternPropertyModel = new CommonModel();
      const pattern = "TestPattern";
      patternPropertyModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addPatternProperty(pattern, patternPropertyModel, {});
      expect(model.patternProperties).toEqual({"TestPattern": patternPropertyModel});
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge additionalProperties together', function() {
      const patternPropertyModel = new CommonModel();
      const pattern = "TestPattern";
      patternPropertyModel.$id = "test"; 
      const model = new CommonModel(); 
      model.addPatternProperty(pattern, patternPropertyModel, {});
      model.addPatternProperty(pattern, patternPropertyModel, {});
      expect(model.patternProperties).toEqual({"TestPattern": patternPropertyModel});
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, patternPropertyModel, patternPropertyModel, {});
    });
  });
  describe('addEnum', function() {
    test('should add enum', function() {
      const model = new CommonModel(); 
      const enumToAdd = 'test';
      model.addEnum(enumToAdd);
      expect(model.enum).toEqual([enumToAdd]);
    });
    test('should not add enum if it already exist', function() {
      const model = new CommonModel(); 
      const enumToAdd = 'test';
      model.addEnum(enumToAdd);
      model.addEnum(enumToAdd);
      expect(model.enum).toEqual([enumToAdd]);
    });
  });
  describe('addTypes', function() {
    test('should add multiple types', function() {
      const model = new CommonModel(); 
      model.addTypes(['type1', 'type2']);
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should add type as is', function() {
      const model = new CommonModel(); 
      model.addTypes('type');
      expect(model.type).toEqual('type');
    });
    test('should add type to existing type', function() {
      const model = new CommonModel(); 
      model.type = ['type1'];
      model.addTypes('type2');
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should set an array when adding two types', function() {
      const model = new CommonModel(); 
      model.addTypes('type1');
      model.addTypes('type2');
      expect(model.type).toEqual(['type1', 'type2']);
    });
  });

  describe('removeType', function() {
    test('should remove single type', function() {
      const model = new CommonModel(); 
      model.addTypes('type1');
      model.removeType('type1');
      expect(model.type).toBeUndefined();
    });
    test('should not remove non matching type', function() {
      const model = new CommonModel(); 
      model.addTypes('type');
      model.removeType('type1');
      expect(model.type).toEqual('type');
    });
    test('should remove multiple types', function() {
      const model = new CommonModel(); 
      model.addTypes(['type1', 'type2']);
      model.removeType(['type1', 'type2']);
      expect(model.type).toBeUndefined();
    });
  });
  describe('removeEnum', function() {
    test('should remove single enum', function() {
      const model = new CommonModel(); 
      model.addEnum('enum1');
      model.removeEnum('enum1');
      expect(model.enum).toBeUndefined();
    });
    test('should not remove non matching enum', function() {
      const model = new CommonModel(); 
      model.addEnum('enum');
      model.removeEnum('enum1');
      expect(model.enum).toEqual(['enum']);
    });
    test('should remove multiple enums', function() {
      const model = new CommonModel(); 
      model.addEnum('enum1');
      model.addEnum('enum2');
      model.removeEnum(['enum1', 'enum2']);
      expect(model.enum).toBeUndefined();
    });
  });
  describe('helpers', function() {
    describe('getFromSchema', function() {
      test('should work', function() {
        const doc = { type: "string", description: "Some description" };
        const d = CommonModel.toCommonModel(doc);
        d.originalSchema = doc;
        const desc = d.getFromSchema('description');
        expect(desc).toEqual(doc.description);
      });
    });

    describe('isRequired', function() {
      test('check that property is required', function() {
        const doc = { type: "object", properties: { prop: { type: "string" } } };
        const d = CommonModel.toCommonModel(doc);
        d.required = ["prop"];
        expect(d.isRequired("prop")).toEqual(true);
        expect(d.isRequired("propX")).toEqual(false);
      });
    });

    describe('getImmediateDependencies', function() {
      test('check that all dependencies are returned', function() {
        const doc = { additionalProperties: { $ref: "1" }, extend: ["2"], items: { $ref: "3" }, properties: { testProp: { $ref: "4" } }  };
        const d = CommonModel.toCommonModel(doc);
        expect(d.getImmediateDependencies()).toEqual(["1", "2", "3", "4"]);
      });
      test('check that no dependencies is returned if there are none', function() {
        const doc = {  };
        const d = CommonModel.toCommonModel(doc);
        expect(d.getImmediateDependencies()).toEqual([]);
      });
    });
  });
});
