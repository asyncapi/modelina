import * as fs from 'fs';
import * as path from 'path';
import simplifyTypes from '../../src/simplification/SimplifyTypes';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of types', () => {
  describe('as is', () => {
    test('should return number type', () => {
      const schema: unknown = { type: 'number' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('number');
    });
    test('should return object type', () => {
      const schema: unknown = { type: 'object' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('object');
    });
    test('should return array type', () => {
      const schema: unknown = { type: 'array' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('array');
    });
    test('should return null type', () => {
      const schema: unknown = { type: 'null' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('null');
    });
    test('should return boolean type', () => {
      const schema: unknown = { type: 'boolean' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('boolean');
    });
    test('should return string type', () => {
      const schema: unknown = { type: 'string' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('string');
    });
  });
  describe('absence of types', () => {
    test('should if true return all types', () => {
      const schema: unknown = true;
      const types = simplifyTypes(schema);
      expect(types).toEqual(['object', 'string', 'number', 'array', 'boolean', 'null',
        'integer']);
    });
  });

  describe('from allOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number', 'boolean'].sort());
    });
  });

  describe('from oneOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number', 'boolean'].sort());
    });
  });

  test('array should be inferred if items are defined', () => {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './types/items.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const types = simplifyTypes(schema);
    expect(types).toEqual('array');
  });
  test('object should be inferred if properties are defined', () => {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './types/properties.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const types = simplifyTypes(schema);
    expect(types).toEqual('object');
  });

  describe('from anyOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number', 'boolean'].sort());
    });
  });
  describe('from conditional if/then/else ', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number', 'boolean'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['string', 'number', 'boolean', 'null', 'array'].sort());
    });
  });
  describe('from enum', () => {
    test('should ignore enums if type already defined', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/enumIgnoreInvalid.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(types).toEqual('string');
    });
    test('with all types', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './types/enum.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['object', 'string', 'number', 'array', 'boolean', 'null'].sort());
    });
  });
  describe('from const', () => {
    test('with string', () => {
      const schema = { const: 'something' };
      const types = simplifyTypes(schema);
      expect(types).toEqual('string');
    });
    test('with boolean', () => {
      const schema = { const: true };
      const types = simplifyTypes(schema);
      expect(types).toEqual('boolean');
    });
    test('with null', () => {
      const schema = { const: null };
      const types = simplifyTypes(schema);
      expect(types).toEqual('null');
    });
    test('with number', () => {
      const schema = { const: 123 };
      const types = simplifyTypes(schema);
      expect(types).toEqual('number');
    });
    test('with bigint', () => {
      const schema = { const: BigInt(123) };
      const types = simplifyTypes(schema);
      expect(types).toEqual('integer');
    });
    test('with array', () => {
      const schema = {
        const: ['test']
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual('array');
    });
    test('Should not infer type if defined earlier', () => {
      const schema = {
        type: 'boolean',
        const: ['test']
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual('boolean');
    });
  });
  describe('from not', () => {
    test('with only one type', () => {
      const schema = {
        not: {
          type: 'string'
        }
      };
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['object', 'number', 'array', 'boolean', 'null',
        'integer'].sort());
    });
    test('with multiple types', () => {
      const schema = {
        not: {
          type: ['string', 'number']
        }
      };
      const types = simplifyTypes(schema);
      expect(Array.isArray(types)).toEqual(true);
      expect((types as string[]).sort()).toEqual(['object', 'array', 'boolean', 'null',
        'integer'].sort());
    });
    test('should acknowledge previous defined types', () => {
      const schema = {
        type: ['string', 'number', 'null'],
        not: {
          type: ['string', 'number']
        }
      };
      const types = simplifyTypes(schema);
      expect(types).toEqual('null');
    });
  });
  test('should return already seen schemas', () => {
    const alreadySeen = new Map<unknown, string[] | string | undefined>();
    const schema = {$id: 'test'};
    alreadySeen.set(schema, 'output');
    const output = simplifyTypes(schema, alreadySeen);
    expect(output).toEqual('output');
  });
});
