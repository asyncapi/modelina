import * as fs from 'fs';
import * as path from 'path';
import simplifyEnums from '../../src/simplification/SimplifyEnums';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of enum', () => {
  test('should return undefined when boolean', () => {
    const schema: any = true;
    const enums = simplifyEnums(schema);
    expect(enums).toBeUndefined();
  });
  test('should return as is', () => {
    const schema: any = { enum: ['test']};
    const enums = simplifyEnums(schema);
    expect(enums).not.toBeUndefined();
    expect(enums).toEqual(['test']);
  });
  describe('from allOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect((enums as any[]).sort()).toEqual(['test1', 'test2'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2', 'test3'].sort());
    });
  });

  describe('from oneOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2', 'test3'].sort());
    });
  });

  describe('from anyOf schemas', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2', 'test3'].sort());
    });
  });
  describe('from conditional if/then/else ', () => {
    test('with simple schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2'].sort());
    });
    test('with nested schema', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test1', 'test2', 'test3', 'test4'].sort());
    });
  });
  describe('from const', () => {
    test('with string', () => {
      const schema = {const: 'something'};
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect(enums).toEqual(['something']);
    });
    test('with boolean', () => {
      const schema = {const: true};
      const enums = simplifyEnums(schema);
      expect(enums).toEqual([true]);
    });
    test('with null', () => {
      const schema = {const: null};
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect(enums).toEqual([null]);
    });
    test('with number', () => {
      const schema = {const: 123};
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect(enums).toEqual([123]);
    });
    test('with array', () => {
      const schema = {
        const: ['test']
      };
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect(enums).toEqual([['test']]);
    });
    test('with already defined enums should be ignored', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/const.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual([1234].sort());
    });
  });
  describe('from not', () => {
    test('with all', () => {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './enums/not.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const enums = simplifyEnums(schema);
      expect(enums).not.toBeUndefined();
      expect((enums as any[]).sort()).toEqual(['test2'].sort());
    });
  });

  test('should return already seen schemas', () => {
    const alreadySeen = new Map<any, any[] | undefined>();
    const schema = {$id: 'test'};
    alreadySeen.set(schema, ['output']);
    const output = simplifyEnums(schema, alreadySeen);
    expect(output).toEqual(['output']);
  });
});
