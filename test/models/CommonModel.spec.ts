import {CommonModel} from '../../src/models/CommonModel';
describe('CommonModel', () => {
  describe('$id', () => {
    test('should return a string', () => {
      const doc: any = { $id: 'test' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.$id).not.toBeUndefined();
      expect(typeof d.$id).toEqual('string');
      expect(d.$id).toEqual(doc.$id);
    });
  });

  describe('enum', () => {
    test('should return a number', () => {
      const doc: any = { type: 'string', enum: ['test'] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.enum).not.toBeUndefined();
      expect(Array.isArray(d.enum)).toEqual(true);
      expect(d.enum).toEqual(doc.enum);
    });
  });

  describe('type', () => {
    test('should return a string', () => {
      const doc: any = { type: 'string' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.type).not.toBeUndefined();
      expect(typeof d.type).toEqual('string');
      expect(d.type).toEqual(doc.type);
    });
    
    test('should return an array of strings', () => {
      const doc: any = { type: ['number', 'string'] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.type).not.toBeUndefined();
      expect(Array.isArray(d.type)).toEqual(true);
      expect(d.type).toEqual(doc.type);
    });
  });

  describe('items', () => {
    it('should return a CommonModel object', () => {
      const doc: any = { items: { type: 'string' } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.items).not.toBeUndefined();
      expect(d.items!.constructor.name).toEqual('CommonModel');
      expect(d.items).toEqual(doc.items);
    });
    
    test('should return an array of CommonModel objects', () => {
      const doc: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const d = CommonModel.toCommonModel(doc);
      expect(d.items).not.toBeUndefined();
      expect(Array.isArray(d.items)).toEqual(true);
      for (const [i, s] of (d.items as CommonModel[]).entries()) {
        expect(s.constructor.name).toEqual('CommonModel');
        expect(s).toEqual(doc.items[i]);
      }
    });
  });

  describe('properties', () => {
    test('should return a map of CommonModel objects', () => {
      const doc: any = { properties: { test: { type: 'string' } } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.properties).not.toBeUndefined();
      expect(typeof d.properties).toEqual('object');
      for (const key of Object.keys(d.properties!)) {
        const s = d.properties![key];
        expect(s.constructor.name).toEqual('CommonModel');
        expect(s).toEqual(doc.properties[key]);
      }
    });
  });

  describe('additionalProperties', () => {
    test('should return a CommonModel object', () => {
      const doc: any = { additionalProperties: { type: 'string' } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).not.toBeUndefined();
      expect(d.additionalProperties!.constructor.name).toEqual('CommonModel');
      expect(d.additionalProperties!).toEqual(doc.additionalProperties);
    });
    
    test('should return a boolean', () => {
      const doc: any = { additionalProperties: true };
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).not.toBeUndefined();
      expect(typeof d.additionalProperties).toEqual('boolean');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });
    
    test('should return undefined when not defined', () => {
      const doc: any = {};
      const d = CommonModel.toCommonModel(doc);
      expect(d.additionalProperties).toEqual(undefined);
    });
  });

  describe('additionalItems', () => {
    test('should return a Schema object', () => {
      const doc: any = { additionalItems: { type: 'string' } };
      const d = CommonModel.toCommonModel(doc);
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).not.toBeUndefined();
      expect(d.additionalItems!.constructor.name).toEqual('CommonModel');
      expect(d.additionalItems).toEqual(doc.additionalItems);
    });
    
    test('should return undefined when not defined', () => {
      const doc: any = {};
      const d = CommonModel.toCommonModel(doc);
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).toEqual(undefined);
    });
    
    test('should return undefined when undefined', () => {
      const doc: any = { additionalItems: undefined };
      const d = CommonModel.toCommonModel(doc);
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).toEqual(undefined);
    });
  });
  describe('$ref', () => {
    test('should return a string ', () => {
      const doc: any = { $ref: 'some/reference' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.$ref).not.toBeUndefined();
      expect(typeof d.$ref).toEqual('string');
      expect(d.$ref).toEqual(doc.$ref);
    });
  });
  describe('extend', () => {
    test('should return a string ', () => {
      const doc: any = { extend: 'reference' };
      const d = CommonModel.toCommonModel(doc);
      expect(d.extend).not.toBeUndefined();
      expect(typeof d.extend).toEqual('string');
      expect(d.extend).toEqual(doc.extend);
    });
  });
  describe('originalSchema', () => {
    test('should return a schema', () => {
      const doc: any = { originalSchema: { type: 'string', minLength: 2 } };
      const d = CommonModel.toCommonModel(doc);
      expect(d.originalSchema).not.toBeUndefined();
      expect(d.originalSchema!.constructor.name).toEqual('Schema');
      expect(d.originalSchema).toEqual(doc.originalSchema);
    });
  });
  describe('toCommonModel', () => {
    test('should never return the same instance of properties', () => {
      const doc: any = { type: 'string', properties: {test: {type: 'string'}} };
      const d = CommonModel.toCommonModel(doc);
      const d2 = CommonModel.toCommonModel(d);
      d.properties!['test'].$id = 'test';
      expect(d.properties!['test'].$id).toEqual('test');
      expect(d2.properties!['test'].$id).not.toEqual('test');
    });
    test('should never return the same instance of items', () => {
      const doc: any = { type: 'string', items: [{type: 'string'}] };
      const d = CommonModel.toCommonModel(doc);
      const d2 = CommonModel.toCommonModel(d);
      const d_items : CommonModel[] = d.items as CommonModel[];
      const d2_items : CommonModel[] = d2.items as CommonModel[];
      d_items[0].$id = 'test';
      expect(d_items[0].$id).toEqual('test');
      expect(d2_items[0].$id).not.toEqual('test');
    });
  });
  describe('mergeCommonModels', () => {
    test('should handle recursive models', () => {
      const doc: any = { };
      let doc1 = CommonModel.toCommonModel(doc);
      doc1.properties = {
        recursive: doc1
      };
      const doc2 = CommonModel.toCommonModel(doc);
      doc2.properties = {
        recursive: doc2
      };
      doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
      expect(doc1.properties).not.toBeUndefined();
      expect(doc1.properties!['recursive']).not.toBeUndefined();
      expect(doc1.properties!['recursive']).toEqual(doc1);
    });
    describe('$id', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = 'test';
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toEqual(doc2.$id);
      });
      test('should not be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = 'test';
        doc1.$id = 'temp';
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).not.toEqual(doc2.$id);
        expect(doc1.$id).toEqual('temp');
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$id).toBeUndefined();
      });
    });
    describe('required', () => {
      test('should contain the same if right side is not defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ['test'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(['test']);
      });
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.required = ['test'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(doc2.required);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ['test'];
        doc2.required = ['test2'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(['test', 'test2']);
      });
      test('should only contain one if duplicate', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1.required = ['test'];
        doc2.required = ['test'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toEqual(['test']);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.required).toBeUndefined();
      });
    });
    describe('$ref', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.$ref = 'test';
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toEqual(doc2.$ref);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = 'test';
        doc1.$id = 'temp';
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toEqual(doc2.$ref);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.$ref).toBeUndefined();
      });
    });
    describe('extend', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.extend = ['test'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toEqual(doc2.extend);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.$id = 'test';
        doc1.$id = 'temp';
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toEqual(doc2.extend);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toBeUndefined();
      });
    });
    describe('type', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.type = ['string'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.type).toEqual(doc2.type);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.type = ['string'];
        doc1.type = ['number'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.type).toEqual(['number', 'string']);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.extend).toBeUndefined();
      });
    });
    describe('enum', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ['string'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(doc2.enum);
      });
      test('Should not contain duplicate values', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ['string'];
        doc1.enum = ['string'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(['string']);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.enum = ['string'];
        doc1.enum = ['number'];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toEqual(['number', 'string']);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.enum).toBeUndefined();
      });
    });
    describe('items', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = CommonModel.toCommonModel({type: 'string'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toEqual(doc2.items);
      });
      test('should be merged when only left side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1.items = CommonModel.toCommonModel({type: 'string'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject({type: 'string'});
      });
      test('should handle empty items', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toBeUndefined();
      });
      test('should be merged when both sides are defined as schemas', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = CommonModel.toCommonModel({type: 'string'});
        doc1.items = CommonModel.toCommonModel({type: 'number'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject({type: ['number', 'string']});
      });
      test('should not do anything if right side is an empty array', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [];
        doc1.items = CommonModel.toCommonModel({type: 'number'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject({type: 'number'});
      });
      test('Should handle left side is a tuple and right side is not', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = CommonModel.toCommonModel({type: 'string'});
        doc1.items = [CommonModel.toCommonModel({type: 'number'})];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject([{type: 'number'}]);
      });
      test('Should handle right side is a tuple and left side is not', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [CommonModel.toCommonModel({type: 'string'})];
        doc1.items = CommonModel.toCommonModel({type: 'number'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject([{type: 'string'}]);
      });
      test('should be merged when both sides are defined as array of schemas with different lengths', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.items = [CommonModel.toCommonModel({type: 'string'}), CommonModel.toCommonModel({type: 'boolean'})];
        doc1.items = [CommonModel.toCommonModel({type: 'number'})];
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toMatchObject([{type: ['number', 'string']}, {type: 'boolean'}]);
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.items).toBeUndefined();
      });
    });

    describe('properties', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {testProp: CommonModel.toCommonModel({type: 'string'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual(doc2.properties);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {testProp: CommonModel.toCommonModel({type: 'string'})};
        doc1.properties = {testProp2: CommonModel.toCommonModel({type: 'number'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual({testProp: {type: 'string'}, testProp2: {type: 'number'}});
      });
      test('should be merged together when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.properties = {testProp: CommonModel.toCommonModel({type: 'string'})};
        doc1.properties = {testProp: CommonModel.toCommonModel({type: 'number'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toEqual({testProp: {type: ['number', 'string'], originalSchema: {}}});
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.properties).toBeUndefined();
      });
    });
    describe('additionalProperties', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalProperties = CommonModel.toCommonModel({type: 'string'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalProperties).toEqual(doc2.additionalProperties);
      });
      test('should be merged together when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalProperties = CommonModel.toCommonModel({type: 'string'});
        doc1.additionalProperties = CommonModel.toCommonModel({type: 'number'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalProperties).toEqual({type: ['number', 'string'], originalSchema: {}});
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalProperties).toBeUndefined();
      });
    });
    describe('additionalItems', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalItems = CommonModel.toCommonModel({type: 'string'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalItems).toEqual(doc2.additionalItems);
      });
      test('should be merged together when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.additionalItems = CommonModel.toCommonModel({type: 'string'});
        doc1.additionalItems = CommonModel.toCommonModel({type: 'number'});
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalItems).toEqual({type: ['number', 'string'], originalSchema: {}});
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.additionalItems).toBeUndefined();
      });
    });

    describe('patternProperties', () => {
      test('should be merged when only right side is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {pattern1: CommonModel.toCommonModel({type: 'string'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual(doc2.patternProperties);
      });
      test('should be merged when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {pattern1: CommonModel.toCommonModel({type: 'string'})};
        doc1.patternProperties = {pattern2: CommonModel.toCommonModel({type: 'number'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual({pattern1: {type: 'string'}, pattern2: {type: 'number'}});
      });
      test('should be merged together when both sides are defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc2.patternProperties = {pattern1: CommonModel.toCommonModel({type: 'string'})};
        doc1.patternProperties = {pattern1: CommonModel.toCommonModel({type: 'number'})};
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toEqual({pattern1: {type: ['number', 'string'], originalSchema: {}}});
      });
      test('should not change if nothing is defined', () => {
        const doc: any = { };
        let doc1 = CommonModel.toCommonModel(doc);
        const doc2 = CommonModel.toCommonModel(doc);
        doc1 = CommonModel.mergeCommonModels(doc1, doc2, doc);
        expect(doc1.patternProperties).toBeUndefined();
      });
    });
  });
  
  describe('addItem', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add items to model', () => {
      const itemModel = new CommonModel();
      itemModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addItem(itemModel, {});
      expect(model.items).toEqual(itemModel);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge items together', () => {
      const itemModel = new CommonModel();
      itemModel.$id = 'test'; 
      const model = new CommonModel();
      model.items = itemModel;
      model.addItem(itemModel, {});
      model.addItem(itemModel, {});
      expect(model.items).toEqual(itemModel);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, itemModel, itemModel, {});
    });
  });
  describe('addItemTuple', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add tuple item to model', () => {
      const itemModel = new CommonModel();
      itemModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addItemTuple(itemModel, {}, 0);
      expect(model.items).toEqual([itemModel]);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge tuple item if same index', () => {
      const itemModel = new CommonModel();
      itemModel.$id = 'test'; 
      const model = new CommonModel();
      model.items = itemModel;
      model.addItemTuple(itemModel, {}, 0);
      model.addItemTuple(itemModel, {}, 0);
      expect(model.items).toEqual([itemModel]);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, itemModel, itemModel, {});
    });
  });
  describe('addProperty', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add property to model', () => {
      const propertyModel = new CommonModel();
      propertyModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addProperty('test', propertyModel, {});
      expect(model.properties).toEqual({test: propertyModel});
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge if already existing property', () => {
      const propertyModel = new CommonModel();
      propertyModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.properties = {
        test: propertyModel
      };
      model.addProperty('test', propertyModel, {});
      expect(model.properties).toEqual({test: propertyModel});
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, propertyModel, propertyModel, {});
    });
  });
  describe('addExtendedModel', () => {
    test('should extend model', () => {
      const extendedModel = new CommonModel();
      extendedModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      expect(model.extend).toEqual(['test']);
    });
    test('should ignore model if it has no $id', () => {
      const extendedModel = new CommonModel();
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      expect(model.extend).toBeUndefined();
    });
    test('should ignore duplicate model $id', () => {
      const extendedModel = new CommonModel();
      extendedModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addExtendedModel(extendedModel);
      model.addExtendedModel(extendedModel);
      expect(model.extend).toEqual(['test']);
    });
  });
  describe('setTypes', () => {
    test('should set multiple types', () => {
      const model = new CommonModel(); 
      model.setType(['type1', 'type2']);
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should set array type as regular type with length 1', () => {
      const model = new CommonModel(); 
      model.setType(['type']);
      expect(model.type).toEqual('type');
    });
    test('should set type undefined with array of length 0', () => {
      const model = new CommonModel(); 
      model.setType([]);
      expect(model.type).toBeUndefined();
    });
    test('should set type as is', () => {
      const model = new CommonModel(); 
      model.setType('type');
      expect(model.type).toEqual('type');
    });
    test('should set type overwriting existing type', () => {
      const model = new CommonModel(); 
      model.type = ['type1'];
      model.setType('type2');
      expect(model.type).toEqual('type2');
    });
    test('should overwrite already sat type', () => {
      const model = new CommonModel(); 
      model.setType('type1');
      model.setType('type2');
      expect(model.type).toEqual('type2');
    });
  });

  describe('addAdditionalProperty', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add additionalProperties to model', () => {
      const additionalPropertiesModel = new CommonModel();
      additionalPropertiesModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addAdditionalProperty(additionalPropertiesModel, {});
      expect(model.additionalProperties).toEqual(additionalPropertiesModel);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge additionalProperties together', () => {
      const additionalPropertiesModel = new CommonModel();
      additionalPropertiesModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addAdditionalProperty(additionalPropertiesModel, {});
      model.addAdditionalProperty(additionalPropertiesModel, {});
      expect(model.additionalProperties).toEqual(additionalPropertiesModel);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, additionalPropertiesModel, additionalPropertiesModel, {});
    });
  });

  describe('addAdditionalItems', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add additionalItems to model', () => {
      const additionalItemsModel = new CommonModel();
      additionalItemsModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addAdditionalItems(additionalItemsModel, {});
      expect(model.additionalItems).toEqual(additionalItemsModel);
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge additionalItems together', () => {
      const additionalItemsModel = new CommonModel();
      additionalItemsModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addAdditionalItems(additionalItemsModel, {});
      model.addAdditionalItems(additionalItemsModel, {});
      expect(model.additionalItems).toEqual(additionalItemsModel);
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, additionalItemsModel, additionalItemsModel, {});
    });
  });
  describe('addPatternProperty', () => {
    beforeAll(() => {
      jest.spyOn(CommonModel, 'mergeCommonModels');
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('should add patternProperty to model', () => {
      const patternPropertyModel = new CommonModel();
      const pattern = 'TestPattern';
      patternPropertyModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addPatternProperty(pattern, patternPropertyModel, {});
      expect(model.patternProperties).toEqual({TestPattern: patternPropertyModel});
      expect(CommonModel.mergeCommonModels).not.toHaveBeenCalled();
    });
    test('should merge additionalProperties together', () => {
      const patternPropertyModel = new CommonModel();
      const pattern = 'TestPattern';
      patternPropertyModel.$id = 'test'; 
      const model = new CommonModel(); 
      model.addPatternProperty(pattern, patternPropertyModel, {});
      model.addPatternProperty(pattern, patternPropertyModel, {});
      expect(model.patternProperties).toEqual({TestPattern: patternPropertyModel});
      expect(CommonModel.mergeCommonModels).toHaveBeenNthCalledWith(1, patternPropertyModel, patternPropertyModel, {});
    });
  });
  describe('addEnum', () => {
    test('should add enum', () => {
      const model = new CommonModel(); 
      const enumToAdd = 'test';
      model.addEnum(enumToAdd);
      expect(model.enum).toEqual([enumToAdd]);
    });
    test('should not add enum if it already exist', () => {
      const model = new CommonModel(); 
      const enumToAdd = 'test';
      model.addEnum(enumToAdd);
      model.addEnum(enumToAdd);
      expect(model.enum).toEqual([enumToAdd]);
    });
  });
  describe('addTypes', () => {
    test('should add multiple types', () => {
      const model = new CommonModel(); 
      model.addTypes(['type1', 'type2']);
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should add type as is', () => {
      const model = new CommonModel(); 
      model.addTypes('type');
      expect(model.type).toEqual('type');
    });
    test('should add type to existing type', () => {
      const model = new CommonModel(); 
      model.type = ['type1'];
      model.addTypes('type2');
      expect(model.type).toEqual(['type1', 'type2']);
    });
    test('should set an array when adding two types', () => {
      const model = new CommonModel(); 
      model.addTypes('type1');
      model.addTypes('type2');
      expect(model.type).toEqual(['type1', 'type2']);
    });
  });

  describe('removeType', () => {
    test('should remove single type', () => {
      const model = new CommonModel(); 
      model.addTypes('type1');
      model.removeType('type1');
      expect(model.type).toBeUndefined();
    });
    test('should not remove non matching type', () => {
      const model = new CommonModel(); 
      model.addTypes('type');
      model.removeType('type1');
      expect(model.type).toEqual('type');
    });
    test('should remove multiple types', () => {
      const model = new CommonModel(); 
      model.addTypes(['type1', 'type2']);
      model.removeType(['type1', 'type2']);
      expect(model.type).toBeUndefined();
    });
  });
  describe('removeEnum', () => {
    test('should remove single enum', () => {
      const model = new CommonModel(); 
      model.addEnum('enum1');
      model.removeEnum('enum1');
      expect(model.enum).toBeUndefined();
    });
    test('should not remove non matching enum', () => {
      const model = new CommonModel(); 
      model.addEnum('enum');
      model.removeEnum('enum1');
      expect(model.enum).toEqual(['enum']);
    });
    test('should remove multiple enums', () => {
      const model = new CommonModel(); 
      model.addEnum('enum1');
      model.addEnum('enum2');
      model.removeEnum(['enum1', 'enum2']);
      expect(model.enum).toBeUndefined();
    });
  });
  describe('helpers', () => {
    describe('getFromSchema', () => {
      test('should work', () => {
        const doc = { type: 'string', description: 'Some description' };
        const d = CommonModel.toCommonModel(doc);
        d.originalSchema = doc;
        const desc = d.getFromSchema('description');
        expect(desc).toEqual(doc.description);
      });
    });

    describe('isRequired', () => {
      test('check that property is required', () => {
        const doc = { type: 'object', properties: { prop: { type: 'string' } } };
        const d = CommonModel.toCommonModel(doc);
        d.required = ['prop'];
        expect(d.isRequired('prop')).toEqual(true);
        expect(d.isRequired('propX')).toEqual(false);
      });
    });

    describe('getNearestDependencies', () => {
      test('should work with array of items', () => {
        const doc = { items: [{ $ref: '1' }] };
        const d = CommonModel.toCommonModel(doc);
        expect(d.getNearestDependencies()).toEqual(['1']);
      });
      test('check that all dependencies are returned', () => {
        const doc = { additionalProperties: { $ref: '1' }, extend: ['2'], items: { $ref: '3' }, properties: { testProp: { $ref: '4' } }, patternProperties: {testPattern: {$ref: '5'}}, additionalItems: { $ref: '6' } };
        const d = CommonModel.toCommonModel(doc);
        expect(d.getNearestDependencies()).toEqual(['1', '2', '3', '4', '5', '6']);
      });
      test('check that no dependencies is returned if there are none', () => {
        const doc = { };
        const d = CommonModel.toCommonModel(doc);
        expect(d.getNearestDependencies()).toEqual([]);
      });
    });
  });
});
