import { Draft7Schema } from '../../src/models/Draft7Schema';

describe('Draft7Schema', () => {
  describe('multipleOf', () => {
    test('should return a number', () => {
      const doc = { type: 'number', multipleOf: 1.0 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.multipleOf).not.toBeUndefined();
      expect(typeof d.multipleOf).toEqual('number');
      expect(d.multipleOf).toEqual(doc.multipleOf);
    });
  });

  describe('$id', () => {
    test('should return a string', () => {
      const doc = { $id: 'test' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.$id).not.toBeUndefined();
      expect(typeof d.$id).toEqual('string');
      expect(d.$id).toEqual(doc.$id);
    });
  });

  describe('maximum', () => {
    test('should return a number', () => {
      const doc = { type: 'number', maximum: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.maximum).not.toBeUndefined();
      expect(typeof d.maximum).toEqual('number');
      expect(d.maximum).toEqual(doc.maximum);
    });
  });

  describe('exclusiveMaximum', () => {
    test('should return a number', () => {
      const doc = { type: 'number', exclusiveMaximum: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.exclusiveMaximum).not.toBeUndefined();
      expect(typeof d.exclusiveMaximum).toEqual('number');
      expect(d.exclusiveMaximum).toEqual(doc.exclusiveMaximum);
    });
  });

  describe('minimum', () => {
    test('should return a number', () => {
      const doc = { type: 'number', minimum: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.minimum).not.toBeUndefined();
      expect(typeof d.minimum).toEqual('number');
      expect(d.minimum).toEqual(doc.minimum);
    });
  });

  describe('exclusiveMinimum', () => {
    test('should return a number', () => {
      const doc = { type: 'number', exclusiveMinimum: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.exclusiveMinimum).not.toBeUndefined();
      expect(typeof d.exclusiveMinimum).toEqual('number');
      expect(d.exclusiveMinimum).toEqual(doc.exclusiveMinimum);
    });
  });

  describe('maxLength', () => {
    test('should return a number', () => {
      const doc = { type: 'string', maxLength: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.maxLength).not.toBeUndefined();
      expect(typeof d.maxLength).toEqual('number');
      expect(d.maxLength).toEqual(doc.maxLength);
    });
  });

  describe('minLength', () => {
    test('should return a number', () => {
      const doc = { type: 'string', minLength: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.minLength).not.toBeUndefined();
      expect(typeof d.minLength).toEqual('number');
      expect(d.minLength).toEqual(doc.minLength);
    });
  });

  describe('pattern', () => {
    test('should return a string', () => {
      const doc = { type: 'string', pattern: '^test' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.pattern).not.toBeUndefined();
      expect(typeof d.pattern).toEqual('string');
      expect(d.pattern).toEqual(doc.pattern);
    });
  });

  describe('maxItems', () => {
    test('should return a number', () => {
      const doc = { type: 'array', maxItems: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.maxItems).not.toBeUndefined();
      expect(typeof d.maxItems).toEqual('number');
      expect(d.maxItems).toEqual(doc.maxItems);
    });
  });

  describe('minItems', () => {
    test('should return a number', () => {
      const doc = { type: 'array', minItems: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.minItems).not.toBeUndefined();
      expect(typeof d.minItems).toEqual('number');
      expect(d.minItems).toEqual(doc.minItems);
    });
  });

  describe('uniqueItems', () => {
    test('should return a boolean', () => {
      const doc = { type: 'array', uniqueItems: true };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.uniqueItems).not.toBeUndefined();
      expect(typeof d.uniqueItems).toEqual('boolean');
      expect(d.uniqueItems).toEqual(doc.uniqueItems);
    });
  });

  describe('maxProperties', () => {
    test('should return a number', () => {
      const doc = { type: 'object', maxProperties: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.maxProperties).not.toBeUndefined();
      expect(typeof d.maxProperties).toEqual('number');
      expect(d.maxProperties).toEqual(doc.maxProperties);
    });
  });

  describe('minProperties', () => {
    test('should return a number', () => {
      const doc = { type: 'object', minProperties: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.minProperties).not.toBeUndefined();
      expect(typeof d.minProperties).toEqual('number');
      expect(d.minProperties).toEqual(doc.minProperties);
    });
  });

  describe('required', () => {
    test('should return a number', () => {
      const doc = { type: 'object', required: ['test'] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.required).not.toBeUndefined();
      expect(Array.isArray(d.required)).toEqual(true);
      expect(d.required).toEqual(doc.required);
    });
  });

  describe('enum', () => {
    test('should return a number', () => {
      const doc = { type: 'string', enum: ['test'] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.enum).not.toBeUndefined();
      expect(Array.isArray(d.enum)).toEqual(true);
      expect(d.enum).toEqual(doc.enum);
    });
  });

  describe('type', () => {
    test('should return a string', () => {
      const doc = { type: 'string' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.type).not.toBeUndefined();
      expect(typeof d.type).toEqual('string');
      expect(d.type).toEqual(doc.type);
    });

    test('should return an array of strings', () => {
      const doc = { type: ['number', 'string'] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.type).not.toBeUndefined();
      expect(Array.isArray(d.type)).toEqual(true);
      expect(d.type).toEqual(doc.type);
    });
  });

  describe('allOf', () => {
    test('should return an array of Draft7Schema objects', () => {
      const doc = { allOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.allOf).not.toBeUndefined();
      expect(Array.isArray(d.allOf)).toEqual(true);
      for (const [i, s] of d.allOf!.entries()) {
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect(s).toEqual((doc.allOf as Draft7Schema[])[i]);
      }
    });
  });

  describe('oneOf', () => {
    test('should return an array of Draft7Schema objects', () => {
      const doc = { oneOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.oneOf).not.toBeUndefined();
      expect(Array.isArray(d.oneOf)).toEqual(true);
      for (const [i, s] of d.oneOf!.entries()) {
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect(s).toEqual((doc.oneOf as Draft7Schema[])[i]);
      }
    });
  });

  describe('anyOf', () => {
    test('should return an array of Draft7Schema objects', () => {
      const doc = { anyOf: [{ type: 'string' }, { type: 'number' }] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.anyOf).not.toBeUndefined();
      expect(Array.isArray(d.anyOf)).toEqual(true);
      for (const [i, s] of d.anyOf!.entries()) {
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect(s).toEqual((doc.anyOf as Draft7Schema[])[i]);
      }
    });
  });

  describe('not', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { not: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.not).not.toBeUndefined();
      expect(d.not!.constructor.name).toEqual('Draft7Schema');
      expect(d.not).toEqual(doc.not);
    });
  });

  describe('items', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { items: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.items).not.toBeUndefined();
      expect(d.items!.constructor.name).toEqual('Draft7Schema');
      expect(d.items).toEqual(doc.items);
    });

    test('should return an array of Draft7Schema objects', () => {
      const doc = { items: [{ type: 'string' }, { type: 'number' }] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.items).not.toBeUndefined();
      expect(Array.isArray(d.items)).toEqual(true);
      for (const [i, s] of (d.items as Draft7Schema[]).entries()) {
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect(s).toEqual((doc.items as Draft7Schema[])[i]);
      }
    });
  });

  describe('properties', () => {
    test('should return a map of Draft7Schema objects', () => {
      const doc = { properties: { test: { type: 'string' } } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(typeof d.properties).toEqual('object');
      expect(d.properties).not.toBeUndefined();
      for (const key of Object.keys(d.properties!)) {
        const s = d.properties![key];
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect((s as Draft7Schema).type).toEqual('string');
      }
    });
  });

  describe('additionalProperties', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { additionalProperties: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalProperties).not.toBeUndefined();
      expect(d.additionalProperties!.constructor.name).toEqual('Draft7Schema');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });

    test('should return a boolean', () => {
      const doc = { additionalProperties: true };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalProperties).not.toBeUndefined();
      expect(typeof d.additionalProperties).toEqual('boolean');
      expect(d.additionalProperties).toEqual(doc.additionalProperties);
    });

    test('should return undefined when not defined', () => {
      const doc = {};
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalProperties).toEqual(undefined);
    });
  });

  describe('additionalItems', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { additionalItems: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).not.toBeUndefined();
      expect(d.additionalItems!.constructor.name).toEqual('Draft7Schema');
      expect(d.additionalItems).toEqual(doc.additionalItems);
    });

    test('should return undefined when not defined', () => {
      const doc = {};
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).toEqual(undefined);
    });

    test('should return undefined when undefined', () => {
      const doc = { additionalItems: undefined };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.additionalItems).toEqual(undefined);
    });
  });

  describe('patternProperties', () => {
    test('should return a map of Draft7Schema objects', () => {
      const doc = { patternProperties: { test: { type: 'string' } } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.patternProperties).not.toBeUndefined();
      expect(typeof d.patternProperties).toEqual('object');
      for (const key of Object.keys(d.patternProperties!)) {
        const s = d.patternProperties![key];
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect((s as Draft7Schema).type).toEqual('string');
      }
    });
  });

  describe('const', () => {
    test('should return a number', () => {
      const doc = { type: 'object', const: 10 };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.const).not.toBeUndefined();
      expect(typeof d.const).toEqual('number');
      expect(d.const).toEqual(doc.const);
    });

    test('should return null', () => {
      const doc = { type: 'object', const: null };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.const).not.toBeUndefined();
      expect(d.const).toEqual(doc.const);
    });

    test('should return an object', () => {
      const doc = { type: 'object', const: { test: true } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.const).not.toBeUndefined();
      expect(typeof d.const).toEqual('object');
      expect(d.const).toEqual(doc.const);
    });

    test('should return an array', () => {
      const doc = { type: 'object', const: ['test'] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.const).not.toBeUndefined();
      expect(Array.isArray(d.const)).toEqual(true);
      expect(d.const).toEqual(doc.const);
    });
  });

  describe('contains', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { contains: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.contains).not.toBeUndefined();
      expect(d.contains!.constructor.name).toEqual('Draft7Schema');
      expect(d.contains).toEqual(doc.contains);
    });
  });

  describe('dependencies', () => {
    test('should return a map with an array value', () => {
      const doc = {
        properties: { test: { type: 'string' }, test2: { type: 'number' } },
        dependencies: { test: ['test2'] }
      };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.dependencies).not.toBeUndefined();
      expect(typeof d.dependencies).toEqual('object');
      for (const key of Object.keys(d.dependencies!)) {
        const v: any = d.dependencies![key];
        expect(Array.isArray(v)).toEqual(true);
        expect(v).toEqual((doc.dependencies as Record<string, any>)[key]);
      }
    });

    test('should return a map with a Draft7Schema value', () => {
      const doc = {
        properties: { test: { type: 'string' } },
        dependencies: { test: { properties: { test2: { type: 'number' } } } }
      };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.dependencies).not.toBeUndefined();
      expect(typeof d.dependencies).toEqual('object');
      for (const key of Object.keys(d.dependencies!)) {
        const s: any = d.dependencies![key];
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect(s).toEqual((doc.dependencies as Record<string, any>)[key]);
      }
    });
  });

  describe('propertyNames', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { propertyNames: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.propertyNames).not.toBeUndefined();
      expect(d.propertyNames!.constructor.name).toEqual('Draft7Schema');
      expect(d.propertyNames).toEqual(doc.propertyNames);
    });
  });

  describe('if', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { if: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.if).not.toBeUndefined();
      expect(d.if!.constructor.name).toEqual('Draft7Schema');
      expect(d.if).toEqual(doc.if);
    });
  });

  describe('then', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { then: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.then).not.toBeUndefined();
      expect(d.then!.constructor.name).toEqual('Draft7Schema');
      expect(d.then).toEqual(doc.then);
    });
  });

  describe('else', () => {
    test('should return a Draft7Schema object', () => {
      const doc = { else: { type: 'string' } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.else).not.toBeUndefined();
      expect(d.else!.constructor.name).toEqual('Draft7Schema');
      expect(d.else).toEqual(doc.else);
    });
  });

  describe('format', () => {
    test('should return a string', () => {
      const doc = { type: 'string', format: 'email' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.format).not.toBeUndefined();
      expect(typeof d.format).toEqual('string');
      expect(d.format).toEqual(doc.format);
    });
  });

  describe('contentEncoding', () => {
    test('should return a string', () => {
      const doc = { type: 'string', contentEncoding: 'base64' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.contentEncoding).not.toBeUndefined();
      expect(typeof d.contentEncoding).toEqual('string');
      expect(d.contentEncoding).toEqual(doc.contentEncoding);
    });
  });

  describe('contentMediaType', () => {
    test('should return a string', () => {
      const doc = { type: 'string', contentMediaType: 'text/html' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.contentMediaType).not.toBeUndefined();
      expect(typeof d.contentMediaType).toEqual('string');
      expect(d.contentMediaType).toEqual(doc.contentMediaType);
    });
  });

  describe('description', () => {
    test('should return a string', () => {
      const doc = { description: 'some description' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.description).not.toBeUndefined();
      expect(typeof d.description).toEqual('string');
      expect(d.description).toEqual(doc.description);
    });
  });

  describe('definitions', () => {
    test('should return a map of Draft7Schema objects', () => {
      const doc = { definitions: { test: { type: 'string' } } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.definitions).not.toBeUndefined();
      expect(typeof d.definitions).toEqual('object');
      for (const key of Object.keys(d.definitions!)) {
        const s = d.definitions![key];
        expect(s.constructor.name).toEqual('Draft7Schema');
        expect((s as Draft7Schema).type).toEqual('string');
      }
    });
  });

  describe('title', () => {
    test('should return a string', () => {
      const doc = { type: 'string', title: 'test' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.title).not.toBeUndefined();
      expect(typeof d.title).toEqual('string');
      expect(d.title).toEqual(doc.title);
    });
  });

  describe('default', () => {
    test('should return a value', () => {
      const doc = { type: 'string', default: 'test' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.default).not.toBeUndefined();
      expect(d.default).toEqual('test');
    });
  });

  describe('readOnly', () => {
    test('should return a boolean', () => {
      const doc = { type: 'string', readOnly: true };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.readOnly).not.toBeUndefined();
      expect(typeof d.readOnly).toEqual('boolean');
      expect(d.readOnly).toEqual(doc.readOnly);
    });
  });

  describe('writeOnly', () => {
    test('should return a boolean', () => {
      const doc = { type: 'string', writeOnly: true };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.writeOnly).not.toBeUndefined();
      expect(typeof d.writeOnly).toEqual('boolean');
      expect(d.writeOnly).toEqual(doc.writeOnly);
    });
  });

  describe('$ref', () => {
    test('should return a string', () => {
      const doc = { $ref: 'some/reference' };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.$ref).not.toBeUndefined();
      expect(typeof d.$ref).toEqual('string');
      expect(d.$ref).toEqual(doc.$ref);
    });
  });

  describe('examples', () => {
    test('should return an array', () => {
      const doc = { type: 'string', examples: ['test'] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.examples).not.toBeUndefined();
      expect(Array.isArray(d.examples)).toEqual(true);
      expect(d.examples).toEqual(doc.examples);
    });
  });

  describe('toSchema', () => {
    test('should throw error when trying to convert non-object', () => {
      const expectedError =
        'Could not convert input to expected copy of Draft7Schema';
      expect(() => {
        Draft7Schema.toSchema(1 as any);
      }).toThrow(expectedError);
    });
    test('should handle recursive schemas', () => {
      const recursiveDoc = { type: 'object', properties: {} };
      const doc = { type: 'object', properties: { test: recursiveDoc } };
      (recursiveDoc.properties as any)['test'] = doc;
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft7Schema.toSchema(d as any) as Draft7Schema;
      expect(typeof d2).toEqual('object');
    });
    test('should never return the same instance of properties', () => {
      const doc = { type: 'string', properties: { test: { type: 'string' } } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft7Schema.toSchema(d as any) as Draft7Schema;
      expect(typeof d2).toEqual('object');
      (d.properties!['test'] as Draft7Schema).$id = 'test';
      expect((d.properties!['test'] as Draft7Schema).$id).toEqual('test');
      expect((d2.properties!['test'] as Draft7Schema).$id).not.toEqual('test');
    });
    test('should never return the same instance of items', () => {
      const doc = { type: 'string', items: [{ type: 'string' }] };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      const d2 = Draft7Schema.toSchema(d as any) as Draft7Schema;
      expect(typeof d2).toEqual('object');
      const d_items: Draft7Schema[] = d.items as Draft7Schema[];
      const d2_items: Draft7Schema[] = d2.items as Draft7Schema[];
      d_items[0].$id = 'test';
      expect(d_items[0].$id).toEqual('test');
      expect(d2_items[0].$id).not.toEqual('test');
    });
    test('should never convert value properties', () => {
      const doc = { const: { test: { type: 'string' } } };
      const d = Draft7Schema.toSchema(doc) as Draft7Schema;
      expect(typeof d).toEqual('object');
      expect(d.const instanceof Draft7Schema).toEqual(false);
    });
  });
});
