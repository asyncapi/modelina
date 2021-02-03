import {Schema} from '../../src/models/Schema'; 
describe('Schema', function() {
  describe('multipleOf', function() {
    test('should return a number', function() {
      const doc: any = { type: 'number', multipleOf: 1.0 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.multipleOf).not.toBeUndefined();
      expect(typeof d.multipleOf).toEqual('number');
      expect(d.multipleOf).toEqual(doc.multipleOf);
    });
  })

  describe('$id', function() {
    test('should return a string', function() {
      const doc: any = { $id: 'test' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.$id).not.toBeUndefined();
      expect(typeof d.$id).toEqual('string');
      expect(d.$id).toEqual(doc.$id);
    });
  });
  
  describe('maximum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'number', maximum: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.maximum).not.toBeUndefined();
      expect(typeof d.maximum).toEqual('number');
      expect(d.maximum).toEqual(doc.maximum);
    });
  });
  
  describe('exclusiveMaximum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'number', exclusiveMaximum: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.exclusiveMaximum).not.toBeUndefined();
      expect(typeof d.exclusiveMaximum).toEqual('number');
      expect(d.exclusiveMaximum).toEqual(doc.exclusiveMaximum);
    });
  });
  
  describe('minimum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'number', minimum: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.minimum).not.toBeUndefined();
      expect(typeof d.minimum).toEqual('number');
      expect(d.minimum).toEqual(doc.minimum);
    });
  });
  
  describe('exclusiveMinimum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'number', exclusiveMinimum: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.exclusiveMinimum).not.toBeUndefined();
      expect(typeof d.exclusiveMinimum).toEqual('number');
      expect(d.exclusiveMinimum).toEqual(doc.exclusiveMinimum);
    });
  });
  
  describe('maxLength', function() {
    test('should return a number', function() {
      const doc: any = { type: 'string', maxLength: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.maxLength).not.toBeUndefined();
      expect(typeof d.maxLength).toEqual('number');
      expect(d.maxLength).toEqual(doc.maxLength);
    });
  });
  
  describe('minLength', function() {
    test('should return a number', function() {
      const doc: any = { type: 'string', minLength: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.minLength).not.toBeUndefined();
      expect(typeof d.minLength).toEqual('number');
      expect(d.minLength).toEqual(doc.minLength);
    });
  });
  
  describe('pattern', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string', pattern: '^test' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.pattern).not.toBeUndefined();
      expect(typeof d.pattern).toEqual('string');
      expect(d.pattern).toEqual(doc.pattern);
    });
  });
  
  describe('maxItems', function() {
    test('should return a number', function() {
      const doc: any = { type: 'array', maxItems: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.maxItems).not.toBeUndefined();
      expect(typeof d.maxItems).toEqual('number');
      expect(d.maxItems).toEqual(doc.maxItems);
    });
  });
  
  describe('minItems', function() {
    test('should return a number', function() {
      const doc: any = { type: 'array', minItems: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.minItems).not.toBeUndefined();
      expect(typeof d.minItems).toEqual('number');
      expect(d.minItems).toEqual(doc.minItems);
    });
  });
  
  describe('uniqueItems', function() {
    test('should return a boolean', function() {
      const doc: any = { type: 'array', uniqueItems: true };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.uniqueItems).not.toBeUndefined();
      expect(typeof d.uniqueItems).toEqual('boolean');
      expect(d.uniqueItems).toEqual(doc.uniqueItems);
    });
  });

  describe('maxProperties', function() {
    test('should return a number', function() {
      const doc: any = { type: 'object', maxProperties: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.maxProperties).not.toBeUndefined();
      expect(typeof d.maxProperties).toEqual('number');
      expect(d.maxProperties).toEqual(doc.maxProperties);
    });
  });

  describe('minProperties', function() {
    test('should return a number', function() {
      const doc: any = { type: 'object', minProperties: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.minProperties).not.toBeUndefined();
      expect(typeof d.minProperties).toEqual('number');
      expect(d.minProperties).toEqual(doc.minProperties);
    });
  });

  describe('required', function() {
    test('should return a number', function() {
      const doc: any = { type: 'object', required: ['test'] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.required).not.toBeUndefined();
      expect(Array.isArray(d.required)).toEqual(true);
      expect(d.required).toEqual(doc.required);
    });
  });

  describe('enum', function() {
    test('should return a number', function() {
      const doc: any = { type: 'string', enum: ['test'] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.enum).not.toBeUndefined();
      expect(Array.isArray(d.enum)).toEqual(true);
      expect(d.enum).toEqual(doc.enum);
    });
  });

  describe('type', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.type).not.toBeUndefined();
      expect(typeof d.type).toEqual('string');
      expect(d.type).toEqual(doc.type);
    });
    
    test('should return an array of strings', function() {
      const doc: any = { type: ['number', 'string'] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.type).not.toBeUndefined();
      expect(Array.isArray(d.type)).toEqual(true);
      expect(d.type).toEqual(doc.type);
    });
  });

  describe('allOf', function() {
    test('should return an array of Schema objects', function() {
      const doc: any = { allOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.allOf).not.toBeUndefined();
      expect(Array.isArray(d.allOf)).toEqual(true);
      d.allOf!.forEach((s, i) => {
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.allOf[i]);
      });
    });
  });

  describe('oneOf', function() {
    test('should return an array of Schema objects', function() {
      const doc: any = { oneOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.oneOf).not.toBeUndefined();
      expect(Array.isArray(d.oneOf)).toEqual(true);
      d.oneOf!.forEach((s, i) => {
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.oneOf[i]);
      });
    });
  });

  describe('anyOf', function() {
    test('should return an array of Schema objects', function() {
      const doc: any = { anyOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.anyOf).not.toBeUndefined();
      expect(Array.isArray(d.anyOf)).toEqual(true);
      d.anyOf!.forEach((s, i) => {
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.anyOf[i]);
      });
    });
  });

  describe('not', function() {
    test('should return a Schema object', function() {
      const doc: any = { not: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.not).not.toBeUndefined();
      expect(d.not!.constructor.name).toEqual('Schema');
      expect(d.not).toEqual(doc.not);
    });
  });

  describe('items', function() {
    test('should return a Schema object', function() {
      const doc: any = { items: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.items).not.toBeUndefined();
      expect(d.items!.constructor.name).toEqual('Schema');
      expect(d.items).toEqual(doc.items);
    });
    
    test('should return an array of Schema objects', function() {
      const doc: any = { items: [{ type: 'string' }, { type: 'number' }] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.items).not.toBeUndefined();
      expect(Array.isArray(d.items)).toEqual(true);
      (d.items as Schema[]).forEach((s, i) => {
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.items[i]);
      });
    });
  });

  describe('properties', function() {
    test('should return a map of Schema objects', function() {
      const doc: any = { properties: { test: { type: 'string' } } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(typeof d.properties).toEqual('object');
      expect(d.properties).not.toBeUndefined();
      Object.keys(d.properties!).forEach(key => {
        const s = d.properties![key];
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.properties[<string>key]);
      });
    });
  });

  describe('additionalProperties', function() {
    test('should return a Schema object', function() {
      const doc: any = { additionalProperties: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalProperties).not.toBeUndefined();
      expect(d.additionalProperties!.constructor.name).toEqual('Schema');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });
    
    test('should return a boolean', function() {
      const doc: any = { additionalProperties: true };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalProperties).not.toBeUndefined();
      expect(typeof d.additionalProperties).toEqual('boolean');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });
    
    test('should return undefined when not defined', function() {
      const doc: any = {};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalProperties).toEqual(undefined);
    });
    
    test('should return undefined when null', function() {
      const doc: any = { additionalProperties: null };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalProperties).toEqual(null);
    });
  });

  describe('additionalItems', function() {
    test('should return a Schema object', function() {
      const doc: any = { additionalItems: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalItems).not.toBeUndefined();
      expect(d.additionalItems!.constructor.name).toEqual('Schema');
      expect(d.additionalItems).toEqual(doc.additionalItems);
    });
    
    test('should return undefined when not defined', function() {
      const doc: any = {};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalItems).toEqual(undefined);
    });
    
    test('should return undefined when null', function() {
      const doc: any = { additionalItems: null };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.additionalItems).toEqual(null);
    });
  });

  describe('patternProperties', function() {
    test('should return a map of Schema objects', function() {
      const doc: any = { patternProperties: { test: { type: 'string' } } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.patternProperties).not.toBeUndefined();
      expect(typeof d.patternProperties).toEqual('object');
      Object.keys(d.patternProperties!).forEach(key => {
        const s = d.patternProperties![key];
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.patternProperties[key]);
      });
    });
  });

  describe('const', function() {
    test('should return a number', function() {
      const doc: any = { type: 'object', const: 10 };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.const).not.toBeUndefined();
      expect(typeof d.const).toEqual('number');
      expect(d.const).toEqual(doc.const);
    });
    
    test('should return null', function() {
      const doc: any = { type: 'object', const: null };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.const).not.toBeUndefined();
      expect(d.const).toEqual(doc.const);
    });
    
    test('should return an object', function() {
      const doc: any = { type: 'object', const: { test: true } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.const).not.toBeUndefined();
      expect(typeof d.const).toEqual('object');
      expect(d.const).toEqual(doc.const);
    });
    
    test('should return an array', function() {
      const doc: any = { type: 'object', const: ['test'] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.const).not.toBeUndefined();
      expect(Array.isArray(d.const)).toEqual(true);
      expect(d.const).toEqual(doc.const);
    });
  });

  describe('contains', function() {
    test('should return a Schema object', function() {
      const doc: any = { contains: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.contains).not.toBeUndefined();
      expect(d.contains!.constructor.name).toEqual('Schema');
      expect(d.contains).toEqual(doc.contains);
    });
  });

  describe('dependencies', function() {
    test('should return a map with an array value', function() {
      const doc: any = { properties: { test: { type: 'string' }, test2: { type: 'number' } }, dependencies: { test: ['test2'] } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.dependencies).not.toBeUndefined();
      expect(typeof d.dependencies).toEqual('object');
      Object.keys(d.dependencies!).forEach(key => {
        const v = d.dependencies![key];
        expect(Array.isArray(v)).toEqual(true);
        expect(v).toEqual(doc.dependencies![key]);
      });
    });
    
    test('should return a map with a Schema value', function() {
      const doc: any = { properties: { test: { type: 'string' } }, dependencies: { test: { properties: { test2: { type: 'number' } } } } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.dependencies).not.toBeUndefined();
      expect(typeof d.dependencies).toEqual('object');
      Object.keys(d.dependencies!).forEach(key => {
        const s = d.dependencies![key];
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.dependencies![key]);
      });
    });
  });

  describe('propertyNames', function() {
    test('should return a Schema object', function() {
      const doc: any = { propertyNames: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.propertyNames).not.toBeUndefined();
      expect(d.propertyNames!.constructor.name).toEqual('Schema');
      expect(d.propertyNames).toEqual(doc.propertyNames);
    });
  });

  describe('if', function() {
    test('should return a Schema object', function() {
      const doc: any = { if: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.if).not.toBeUndefined();
      expect(d.if!.constructor.name).toEqual('Schema');
      expect(d.if).toEqual(doc.if);
    });
  });

  describe('then', function() {
    test('should return a Schema object', function() {
      const doc: any = { then: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.then).not.toBeUndefined();
      expect(d.then!.constructor.name).toEqual('Schema');
      expect(d.then).toEqual(doc.then);
    });
  });
  
  describe('else', function() {
    test('should return a Schema object', function() {
      const doc: any = { else: { type: 'string' } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.else).not.toBeUndefined();
      expect(d.else!.constructor.name).toEqual('Schema');
      expect(d.else).toEqual(doc.else);
    });
  });

  describe('format', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string', format: 'email' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.format).not.toBeUndefined();
      expect(typeof d.format).toEqual('string');
      expect(d.format).toEqual(doc.format);
    });
  });

  describe('contentEncoding', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string', contentEncoding: 'base64' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.contentEncoding).not.toBeUndefined();
      expect(typeof d.contentEncoding).toEqual('string');
      expect(d.contentEncoding).toEqual(doc.contentEncoding);
    });
  });

  describe('contentMediaType', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string', contentMediaType: 'text/html' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.contentMediaType).not.toBeUndefined();
      expect(typeof d.contentMediaType).toEqual('string');
      expect(d.contentMediaType).toEqual(doc.contentMediaType);
    });
  });

  describe('description', function() {
    test('should return a string', function() {
      const doc: any = { description: 'some description'};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.description).not.toBeUndefined();
      expect(typeof d.description).toEqual('string');
      expect(d.description).toEqual(doc.description);
    });
  });

  describe('definitions', function() {
    test('should return a map of Schema objects', function() {
      const doc: any = { definitions: { test: { type: 'string' } } };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.definitions).not.toBeUndefined();
      expect(typeof d.definitions).toEqual('object');
      Object.keys(d.definitions!).forEach(key => {
        const s = d.definitions![key];
        expect(s.constructor.name).toEqual('Schema');
        expect(s).toEqual(doc.definitions[key]);
      });
    });
  });

  describe('title', function() {
    test('should return a string', function() {
      const doc: any = { type: 'string', title: 'test' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.title).not.toBeUndefined();
      expect(typeof d.title).toEqual('string');
      expect(d.title).toEqual(doc.title);
    });
  });

  describe('default', function() {
    test('should return a value', function() {
      const doc: any = { type: 'string', default: 'test' };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.default).not.toBeUndefined();
      expect(d.default).toEqual('test');
    });
  });


  describe('readOnly', function() {
    test('should return a boolean', function() {
      const doc: any = { type: 'string', readOnly: true };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.readOnly).not.toBeUndefined();
      expect(typeof d.readOnly).toEqual('boolean');
      expect(d.readOnly).toEqual(doc.readOnly);
    });
  });

  describe('writeOnly', function() {
    test('should return a boolean', function() {
      const doc: any = { type: 'string', writeOnly: true };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.writeOnly).not.toBeUndefined();
      expect(typeof d.writeOnly).toEqual('boolean');
      expect(d.writeOnly).toEqual(doc.writeOnly);
    });
  });

  describe('$ref', function() {
    test('should return a string ', function() {
      const doc: any = { $ref: 'some/reference'};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.$ref).not.toBeUndefined();
      expect(typeof d.$ref).toEqual('string');
      expect(d.$ref).toEqual(doc.$ref);
    });
  });

  describe('examples', function() {
    test('should return an array', function() {
      const doc: any = { type: 'string', examples: ['test'] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      expect(d.examples).not.toBeUndefined();
      expect(Array.isArray(d.examples)).toEqual(true);
      expect(d.examples).toEqual(doc.examples);
    });
  });

  describe('toSchema', function() {
    test('should never return the same instance of properties', function() {
      const doc: any = { type: 'string', properties: {test: {type:"string"}} };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      const d2 = Schema.toSchema(d) as Schema;
      expect(typeof d2).toEqual("object");
      (d.properties!["test"] as Schema).$id = "test";
      expect((d.properties!["test"] as Schema).$id).toEqual("test");
      expect((d2.properties!["test"] as Schema).$id).not.toEqual("test");
    });
    
    test('should never return the same instance of items', function() {
      const doc: any = { type: 'string', items: [{type:"string"}] };
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      const d2 = Schema.toSchema(d) as Schema;
      expect(typeof d2).toEqual("object");
      const d_items : Schema[] = d.items as Schema[];
      const d2_items : Schema[] = d2.items as Schema[];
      d_items[0].$id = "test";
      expect(d_items[0].$id).toEqual("test");
      expect(d2_items[0].$id).not.toEqual("test");
    });
    test('should never return the same instance of dependencies', function() {
      const doc: any = { type: 'object', properties: {test: {type:"string"}}, dependencies: {test: {properties: {test2: { type: "string" }}}}};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      const d2 = Schema.toSchema(d) as Schema;
      expect(typeof d2).toEqual("object");
      (d.dependencies!["test"] as Schema).$id = "test";
      expect((d.dependencies!["test"] as Schema).$id).toEqual("test");
      expect((d2.dependencies!["test"] as Schema).$id).not.toEqual("test");
    });
    test('should never return the same instance of properties', function() {
      const doc: any = { type: 'object', patternProperties: { "^S_": { type: "string" }}};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      const d2 = Schema.toSchema(d) as Schema;
      expect(typeof d2).toEqual("object");
      (d.patternProperties!["^S_"] as Schema).$id = "test";
      expect((d.patternProperties!["^S_"] as Schema).$id).toEqual("test");
      expect((d2.patternProperties!["^S_"] as Schema).$id).not.toEqual("test");
    });
    test('should never return the same instance of definitions', function() {
      const doc: any = { definitions: { "test": { type: "string" }}};
      const d = Schema.toSchema(doc) as Schema;
      expect(typeof d).toEqual("object");
      const d2 = Schema.toSchema(d) as Schema;
      expect(typeof d2).toEqual("object");
      (d.definitions!["test"] as Schema).$id = "test";
      expect((d.definitions!["test"] as Schema).$id).toEqual("test");
      expect((d2.definitions!["test"] as Schema).$id).not.toEqual("test");
    });
  });
});
