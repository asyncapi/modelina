import * as fs from 'fs';
import * as path from 'path';
import simplifyTypes from '../../src/simplification/SimplifyTypes';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of types', function () {
  describe('as is', function () {
    test('should return number type', function () {
      const schema: any = { type: 'number' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("number");
    });
    test('should return object type', function () {
      const schema: any = { type: 'object' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("object");
    });
    test('should return array type', function () {
      const schema: any = { type: 'array' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("array");
    });
    test('should return null type', function () {
      const schema: any = { type: 'null' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("null");
    });
    test('should return boolean type', function () {
      const schema: any = { type: 'boolean' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("boolean");
    });
    test('should return string type', function () {
      const schema: any = { type: 'string' };
      const types = simplifyTypes(schema);
      expect(types).toEqual("string");
    });
  });
  describe('absence of types', function () {
    test('should if true return all types', function () {
      const schema: any = true;
      const types = simplifyTypes(schema);
      expect(types).toEqual(["object", "string", "number", "array", "boolean", "null"]);
    });
    test('should if false return all types', function () {
      const schema: any = false;
      expect(() => { simplifyTypes(schema) }).toThrow("False value schemas are not supported");
    });
  });

  describe('from allOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });

  describe('from oneOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });

  test('array should be inferred if items are defined', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './types/items.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const types = simplifyTypes(schema);
    expect(types).toEqual("array");
  });
  test('object should be inferred if properties are defined', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './types/properties.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const types = simplifyTypes(schema);
    expect(types).toEqual("object");
  });

  describe('from anyOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });
  describe('from conditional if/then/else ', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number", "boolean"].sort());
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["string", "number", "boolean", "null", "array"].sort());
    });
  });
  describe('from enum', function () {
    test('should ignore enums if type already defined', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/enumIgnoreInvalid.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(types).toEqual("string");
    });
    test('with all types', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/enum.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["object", "string", "number", "array", "boolean", "null"].sort());
    });
  });
  describe('from const', function () {
    test('with string', function () {
      const schema = { const: "something" };
      const types = simplifyTypes(schema);
      expect(types).toEqual("string");
    });
    test('with boolean', function () {
      const schema = { const: true };
      const types = simplifyTypes(schema);
      expect(types).toEqual("boolean");
    });
    test('with null', function () {
      const schema = { const: null };
      const types = simplifyTypes(schema);
      expect(types).toEqual("null");
    });
    test('with number', function () {
      const schema = { const: 123 };
      const types = simplifyTypes(schema);
      expect(types).toEqual("number");
    });
    test('with bigint', function () {
      const schema = { const: BigInt(123) };
      const types = simplifyTypes(schema);
      expect(types).toEqual("integer");
    });
    test('with array', function () {
      const schema = {
        const: ["test"]
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual("array");
    });
    test('Should not infer type if defined earlier', function () {
      const schema = {
        type: "boolean",
        const: ["test"]
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual("boolean");
    });
  });
  describe('from not', function () {
    test('with only one type', function () {
      const schema = {
        "not": {
          "type": "string"
        }
      };
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["object", "number", "array", "boolean", "null"].sort());
    });
    test('with multiple types', function () {
      const schema = {
        "not": {
          "type": ["string", "number"]
        }
      };
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as String[]).sort()).toEqual(["object", "array", "boolean", "null"].sort());
    });
    test('should acknowledge previous defined types', function () {
      const schema = {
        "type": ["string", "number", "null"],
        "not": {
          "type": ["string", "number"]
        }
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual("null");
    });
  });
});