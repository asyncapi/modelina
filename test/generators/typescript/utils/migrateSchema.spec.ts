import { migrateSchemaTo202012 } from '../../../../src/generators/typescript/utils/migrateSchema';

describe('migrateSchemaTo202012', () => {
  const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema';

  test('always sets the $schema URI to 2020-12', () => {
    const result = migrateSchemaTo202012({ type: 'object' }, 'draft7');
    expect(result.$schema).toEqual(DRAFT_2020_12);
  });

  test('does not mutate the input schema', () => {
    const input = { definitions: { Foo: { type: 'string' } } };
    const clone = JSON.parse(JSON.stringify(input));
    migrateSchemaTo202012(input, 'draft4');
    expect(input).toEqual(clone);
  });

  describe('definitions → $defs', () => {
    test('renames definitions and rewrites $ref pointers for draft-04', () => {
      const result = migrateSchemaTo202012(
        {
          definitions: { Foo: { type: 'string' } },
          properties: { foo: { $ref: '#/definitions/Foo' } }
        },
        'draft4'
      );
      expect(result.$defs).toEqual({ Foo: { type: 'string' } });
      expect(result.definitions).toBeUndefined();
      expect((result.properties as any).foo.$ref).toEqual('#/$defs/Foo');
    });

    test('renames definitions for draft-07 (previously skipped)', () => {
      const result = migrateSchemaTo202012(
        {
          definitions: { Foo: { type: 'string' } },
          properties: { foo: { $ref: '#/definitions/Foo' } }
        },
        'draft7'
      );
      expect(result.$defs).toEqual({ Foo: { type: 'string' } });
      expect(result.definitions).toBeUndefined();
      expect((result.properties as any).foo.$ref).toEqual('#/$defs/Foo');
    });
  });

  describe('exclusiveMinimum / exclusiveMaximum (draft-04 boolean form)', () => {
    test('converts boolean true to the numeric bound', () => {
      const result = migrateSchemaTo202012(
        { type: 'integer', minimum: 5, exclusiveMinimum: true },
        'draft4'
      );
      expect(result.exclusiveMinimum).toEqual(5);
      expect(result.minimum).toBeUndefined();
    });

    test('drops boolean false rather than leaving an invalid boolean', () => {
      const result = migrateSchemaTo202012(
        {
          type: 'integer',
          minimum: 5,
          exclusiveMinimum: false,
          maximum: 10,
          exclusiveMaximum: false
        },
        'draft4'
      );
      expect(result.exclusiveMinimum).toBeUndefined();
      expect(result.exclusiveMaximum).toBeUndefined();
      expect(result.minimum).toEqual(5);
      expect(result.maximum).toEqual(10);
    });
  });

  describe('tuple items', () => {
    test('converts tuple items to prefixItems for draft-06', () => {
      const result = migrateSchemaTo202012(
        {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        'draft6'
      );
      expect(result.prefixItems).toEqual([
        { type: 'string' },
        { type: 'number' }
      ]);
      expect(result.items).toBeUndefined();
    });

    test('converts companion additionalItems to items', () => {
      const result = migrateSchemaTo202012(
        {
          type: 'array',
          items: [{ type: 'string' }],
          additionalItems: false
        },
        'draft6'
      );
      expect(result.prefixItems).toEqual([{ type: 'string' }]);
      expect(result.items).toEqual(false);
      expect(result.additionalItems).toBeUndefined();
    });

    test('migrates tuple items nested inside additionalProperties', () => {
      const result = migrateSchemaTo202012(
        {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: [{ type: 'string' }, { type: 'number' }]
          }
        },
        'draft4'
      );
      const additional = result.additionalProperties as any;
      expect(additional.prefixItems).toEqual([
        { type: 'string' },
        { type: 'number' }
      ]);
      expect(additional.items).toBeUndefined();
    });
  });

  test('recurses through oneOf/allOf/anyOf and property sub-schemas', () => {
    const result = migrateSchemaTo202012(
      {
        oneOf: [
          {
            type: 'array',
            items: [{ type: 'string' }]
          }
        ],
        properties: {
          nested: {
            definitions: { Bar: { type: 'number' } }
          }
        }
      },
      'draft4'
    );
    expect((result.oneOf as any)[0].prefixItems).toEqual([{ type: 'string' }]);
    expect((result.oneOf as any)[0].items).toBeUndefined();
    expect((result.properties as any).nested.$defs).toEqual({
      Bar: { type: 'number' }
    });
    expect((result.properties as any).nested.definitions).toBeUndefined();
  });
});
