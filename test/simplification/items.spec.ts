import * as fs from 'fs';
import * as path from 'path';
import simplifyItems from '../../src/simplification/SimplifyItems';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of items', function() {
  describe('as is', function() {
    test('should return item', function() {
      const schema: any = { items: { type: "string"}};
      const types = simplifyItems(schema);
      expect(types).toEqual({ items: { type: "string"}});
    });
  });
  describe('absence of types', function() {
    test('should if true return all types', function() {
      const schema: any = true;
      const types = simplifyItems(schema);
      expect(types).toEqual(["object", "string", "number", "array", "boolean", "null"]);
    });
    test('should if false return all types', function() {
      const schema: any = false;
      expect(() => {simplifyItems(schema)}).toThrow("False value schemas are not supported");
    });
  });

  describe('from allOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });

  describe('from oneOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });

  describe('from anyOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number"].sort());
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number", "boolean"].sort());
    });
  });
  describe('from conditional if/then/else ', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number", "boolean"].sort());
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyItems(schema);
      expect(types.sort()).toEqual(["string", "number", "boolean", "null", "array"].sort());
    });
  });
});