/* eslint-disable */

import {
  TypeScriptGenerator,
  TS_COMMON_PRESET
} from '../../../../src/generators';

const dateDoc = {
  $id: 'DateTest',
  type: 'object',
  properties: {
    createdAt: { type: 'string', format: 'date-time' },
    birthDate: { type: 'string', format: 'date' },
    meetingTime: { type: 'string', format: 'time' },
    regularString: { type: 'string' },
    optionalDate: { type: 'string', format: 'date-time' }
  },
  required: ['createdAt']
};

// Schema with nullable types (type: ['null', 'string']) - explicit null in type array
const nullableDoc = {
  $id: 'NullableTest',
  type: 'object',
  properties: {
    // Nullable string (type includes null explicitly)
    nullableString: { type: ['null', 'string'] },
    // Nullable date (type includes null explicitly)
    nullableDate: { type: ['null', 'string'], format: 'date-time' },
    // Required nullable date (required but explicitly allows null)
    requiredNullableDate: { type: ['null', 'string'], format: 'date-time' },
    // Non-nullable required date for comparison
    requiredDate: { type: 'string', format: 'date-time' }
  },
  required: ['requiredNullableDate', 'requiredDate']
};

// Schema exercising array-of-references unmarshal across the
// {required, optional} x {nullable, non-nullable} matrix.
const arrayRefDoc = {
  definitions: {
    RefItem: {
      type: 'object',
      $id: 'RefItem',
      properties: { name: { type: 'string' } }
    }
  },
  $id: 'ArrayRefTest',
  type: 'object',
  properties: {
    requiredRefArray: {
      type: 'array',
      additionalItems: false,
      items: { $ref: '#/definitions/RefItem' }
    },
    optionalRefArray: {
      type: 'array',
      additionalItems: false,
      items: { $ref: '#/definitions/RefItem' }
    },
    requiredNullableRefArray: {
      type: ['null', 'array'],
      additionalItems: false,
      items: { $ref: '#/definitions/RefItem' }
    },
    optionalNullableRefArray: {
      type: ['null', 'array'],
      additionalItems: false,
      items: { $ref: '#/definitions/RefItem' }
    }
  },
  required: ['requiredRefArray', 'requiredNullableRefArray']
};

// Schema exercising nullable iterated kinds (array, union-array, tuple,
// dictionary) in marshal, plus non-nullable and scalar scope locks.
// Root `type: ['null', 'object']` makes the unwrapped additionalProperties
// dictionary itself nullable.
const iterMarshalDoc = {
  definitions: {
    NullIterRef: {
      type: 'object',
      $id: 'NullIterRef',
      properties: { name: { type: 'string' } }
    }
  },
  $id: 'IterMarshalTest',
  type: ['null', 'object'],
  additionalProperties: { type: 'string' },
  properties: {
    nullableArray: {
      type: ['null', 'array'],
      additionalItems: false,
      items: { type: 'string' }
    },
    nonNullableArray: {
      type: 'array',
      additionalItems: false,
      items: { type: 'string' }
    },
    nullableUnionArray: {
      type: ['null', 'array'],
      additionalItems: false,
      items: {
        oneOf: [{ $ref: '#/definitions/NullIterRef' }, { type: 'string' }]
      }
    },
    nullableTuple: {
      type: ['null', 'array'],
      additionalItems: false,
      items: [{ $ref: '#/definitions/NullIterRef' }, { type: 'string' }]
    },
    nullableScalar: { type: ['null', 'string'] }
  }
};

const doc = {
  definitions: {
    NestedTest: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } }
    }
  },
  $id: 'Test',
  type: 'object',
  additionalProperties: {
    oneOf: [{ $ref: '#/definitions/NestedTest' }, { type: 'string' }]
  },
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    enumProp: {
      $id: 'EnumTest',
      enum: ['Some enum String', true, { test: 'test' }, 2]
    },
    numberProp: { type: 'number' },
    nestedObject: { $ref: '#/definitions/NestedTest' },
    unionTest: {
      oneOf: [
        {
          $ref: '#/definitions/NestedTest'
        },
        {
          type: 'string'
        }
      ]
    },
    unionArrayTest: {
      type: 'array',
      additionalItems: false,
      items: {
        oneOf: [
          {
            $ref: '#/definitions/NestedTest'
          },
          {
            type: 'string'
          }
        ]
      }
    },
    arrayTest: {
      type: 'array',
      additionalItems: false,
      items: {
        $ref: '#/definitions/NestedTest'
      }
    },
    primitiveArrayTest: {
      type: 'array',
      additionalItems: false,
      items: {
        type: 'string'
      }
    },
    tupleTest: {
      type: 'array',
      additionalItems: false,
      items: [
        {
          $ref: '#/definitions/NestedTest'
        },
        {
          type: 'string'
        }
      ]
    },
    constTest: {
      type: 'string',
      const: 'TEST'
    }
  }
};
describe('Marshalling preset', () => {
  test('should render un/marshal code', async () => {
    const generator = new TypeScriptGenerator({
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            marshalling: true
          }
        }
      ]
    });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(3);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
    expect(models[2].result).toMatchSnapshot();
  });

  describe('toJson/fromJson methods', () => {
    test('should render toJson method that returns Record<string, unknown>', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // Should have toJson method with correct signature
      expect(result).toContain('public toJson(): Record<string, unknown>');

      // Should return an object, not a string
      expect(result).toMatch(
        /public toJson\(\): Record<string, unknown>\s*\{[\s\S]*?return json;[\s\S]*?\}/
      );
    });

    test('should render fromJson static method that accepts Record<string, unknown>', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // Should have fromJson static method with correct signature
      expect(result).toContain(
        'public static fromJson(obj: Record<string, unknown>): Test'
      );
    });

    test('should render marshal method that calls toJson', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // marshal() should delegate to toJson()
      expect(result).toContain('JSON.stringify(this.toJson())');
    });

    test('should render unmarshal method that calls fromJson', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // unmarshal() should delegate to fromJson()
      expect(result).toContain('.fromJson(');
    });

    test('should render toJson with nested model calling .toJson()', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // For nested objects, toJson should call .toJson() on the nested model
      expect(result).toMatch(/nestedObject.*\.toJson\(\)/);
    });

    test('should render fromJson with nested model calling .fromJson()', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // For nested objects, fromJson should call .fromJson() on the nested model
      expect(result).toContain('NestedTest.fromJson(');
    });

    test('should render toJson for arrays of models calling .toJson()', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // For arrays of models, toJson should map items with .toJson()
      expect(result).toMatch(/\.map\([\s\S]*?\.toJson\(\)/);
    });

    test('should render fromJson for arrays of models calling .fromJson()', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // For arrays of models, fromJson should map items with .fromJson()
      // Check in fromJson context
      expect(result).toMatch(/fromJson[\s\S]*?\.map\(.*NestedTest\.fromJson/);
    });

    test('should render complete toJson/fromJson/marshal/unmarshal methods', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(doc);
      const result = models[0].result;

      // Snapshot for full generated output verification
      expect(result).toMatchSnapshot();
    });
  });

  describe('date unmarshal', () => {
    test('should convert date-formatted string properties to Date objects in unmarshal', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(dateDoc);
      expect(models).toHaveLength(1);
      const result = models[0].result;

      // Should use new Date() conversion for date-time format
      expect(result).toMatch(/new Date\(obj\["createdAt"\]/);

      // Should use new Date() conversion for date format
      expect(result).toMatch(/new Date\(obj\["birthDate"\]/);

      // Should NOT use new Date() for time format
      // time-only strings (e.g., "14:30:00") are not valid Date constructor arguments
      expect(result).not.toMatch(/new Date\(obj\["meetingTime"\]/);

      // Should NOT use new Date() for regular strings
      expect(result).not.toMatch(/new Date\(obj\["regularString"\]/);

      // Snapshot for full verification
      expect(result).toMatchSnapshot();
    });

    test('should emit no null fallback for required non-nullable dates, undefined for optional', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(dateDoc);
      const result = models[0].result;

      // Required non-nullable property (createdAt) must convert directly with no
      // null fallback - a `null` assigned to a non-nullable `Date` field is TS2322.
      expect(result).toContain('new Date(obj["createdAt"] as string)');
      expect(result).not.toMatch(/obj\["createdAt"\]\s*==\s*null\s*\?\s*null/);

      // Optional property (optionalDate) should use undefined in unmarshal
      // Pattern: value == null ? undefined : new Date(value)
      expect(result).toMatch(
        /obj\["optionalDate"\]\s*==\s*null\s*\?\s*undefined\s*:\s*new Date/
      );
    });
  });

  describe('nullable types (type: [null, string])', () => {
    test('should generate correct types and unmarshal for nullable properties', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(nullableDoc);
      expect(models).toHaveLength(1);
      const result = models[0].result;

      // Snapshot for full verification
      expect(result).toMatchSnapshot();
    });

    test('should handle nullable date types with proper null handling', async () => {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(nullableDoc);
      const result = models[0].result;

      // Required non-nullable date must convert directly with no null fallback
      // (a `null` assigned to a non-nullable `Date` field is TS2322).
      expect(result).toContain('new Date(obj["requiredDate"] as string)');
      expect(result).not.toMatch(
        /obj\["requiredDate"\]\s*==\s*null\s*\?\s*null/
      );

      // Required NULLABLE date must keep the `null` fallback (declared `Date | null`).
      expect(result).toMatch(
        /obj\["requiredNullableDate"\]\s*==\s*null\s*\?\s*null\s*:\s*new Date/
      );

      // Nullable date properties should use Date conversion
      // Note: The behavior for nullable types (type: ['null', 'string'])
      // depends on how Modelina interprets them - as union types
      expect(result).toContain('new Date(');
    });
  });

  describe('array-of-references unmarshal', () => {
    async function generateArrayRef(): Promise<string> {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(arrayRefDoc);
      return models[0].result;
    }

    test('required non-nullable array-of-refs maps directly with no null fallback', async () => {
      const result = await generateArrayRef();

      // Required non-nullable -> direct `.map`, no `== null ? null :` branch
      // (a `null` assigned to a non-nullable `RefItem[]` field is TS2322).
      expect(result).toContain(
        '(obj["requiredRefArray"] as Record<string, unknown>[]).map((item: Record<string, unknown>) => RefItem.fromJson(item))'
      );
      expect(result).not.toMatch(/obj\["requiredRefArray"\]\s*==\s*null/);
    });

    test('optional array-of-refs falls back to undefined', async () => {
      const result = await generateArrayRef();

      expect(result).toMatch(
        /obj\["optionalRefArray"\]\s*==\s*null[\s\S]*?\?\s*undefined[\s\S]*?\.map\(\(item: Record<string, unknown>\) => RefItem\.fromJson\(item\)\)/
      );
    });

    test('required nullable array-of-refs falls back to null', async () => {
      const result = await generateArrayRef();

      expect(result).toMatch(
        /obj\["requiredNullableRefArray"\]\s*==\s*null[\s\S]*?\?\s*null[\s\S]*?\.map\(\(item: Record<string, unknown>\) => RefItem\.fromJson\(item\)\)/
      );
    });

    test('optional nullable array-of-refs falls back to undefined', async () => {
      const result = await generateArrayRef();

      expect(result).toMatch(
        /obj\["optionalNullableRefArray"\]\s*==\s*null[\s\S]*?\?\s*undefined[\s\S]*?\.map\(\(item: Record<string, unknown>\) => RefItem\.fromJson\(item\)\)/
      );
    });
  });

  describe('nullable iterated marshal guards', () => {
    async function generateIterMarshal(): Promise<string> {
      const generator = new TypeScriptGenerator({
        presets: [
          {
            preset: TS_COMMON_PRESET,
            options: {
              marshalling: true
            }
          }
        ]
      });
      const models = await generator.generate(iterMarshalDoc);
      return models[0].result;
    }

    test('nullable iterated kinds guard against both undefined and null', async () => {
      const result = await generateIterMarshal();

      // Nullable primitive array, union-array, tuple and dictionary each
      // dereference their value; the guard must narrow away `null` (TS2531).
      expect(result).toContain(
        'if(this.nullableArray !== undefined && this.nullableArray !== null)'
      );
      expect(result).toContain(
        'if(this.nullableUnionArray !== undefined && this.nullableUnionArray !== null)'
      );
      expect(result).toContain(
        'if(this.nullableTuple !== undefined && this.nullableTuple !== null)'
      );
      expect(result).toContain(
        'if(this.additionalProperties !== undefined && this.additionalProperties !== null)'
      );
    });

    test('non-nullable array and nullable scalar keep the plain undefined guard', async () => {
      const result = await generateIterMarshal();

      // Non-nullable iterated array: plain guard, no `!== null`.
      expect(result).toContain('if(this.nonNullableArray !== undefined) {');
      expect(result).not.toContain('this.nonNullableArray !== null');

      // Nullable scalar keeps emitting `null` -> plain `!== undefined` guard.
      expect(result).toContain('if(this.nullableScalar !== undefined) {');
      expect(result).not.toContain('this.nullableScalar !== null');
    });
  });

  describe('mapType serialization', () => {
    // A normal (non-unwrap) dictionary property `tags` plus a top-level
    // `additionalProperties` unwrap dictionary. Both must serialize according
    // to the configured `mapType`, not always as a `Map`.
    const mapDoc = {
      $id: 'MapTypeTest',
      type: 'object',
      properties: {
        tags: { type: 'object', additionalProperties: { type: 'string' } }
      },
      additionalProperties: { type: 'number' }
    };

    async function generateMap(
      mapType: 'map' | 'record' | 'indexedObject'
    ): Promise<string> {
      const generator = new TypeScriptGenerator({
        mapType,
        presets: [{ preset: TS_COMMON_PRESET, options: { marshalling: true } }]
      });
      const models = await generator.generate(mapDoc);
      return models[0].result;
    }

    test('mapType "map" iterates with .entries() and rebuilds with new Map()', async () => {
      const result = await generateMap('map');

      // Normal dictionary property
      expect(result).toContain('for (const [key, value] of this.tags.entries())');
      expect(result).toContain('new Map(Object.entries(obj["tags"]');
      // Unwrap additionalProperties
      expect(result).toContain(
        'for (const [key, value] of this.additionalProperties.entries())'
      );
      expect(result).toContain('instance.additionalProperties = new Map();');
      expect(result).toContain('instance.additionalProperties.set(key,');
    });

    test('mapType "record" iterates with Object.entries() and rebuilds as a plain object', async () => {
      const result = await generateMap('record');

      // No Map usage anywhere in the serializer.
      expect(result).not.toContain('.entries()');
      expect(result).not.toContain('new Map(');

      // Normal dictionary property
      expect(result).toContain(
        'for (const [key, value] of Object.entries(this.tags))'
      );
      expect(result).toContain('obj["tags"] as Record<string, string>');
      // Unwrap additionalProperties
      expect(result).toContain(
        'for (const [key, value] of Object.entries(this.additionalProperties))'
      );
      expect(result).toContain('instance.additionalProperties = {};');
      expect(result).toContain('instance.additionalProperties[key] =');
    });

    test('mapType "indexedObject" behaves like a plain object', async () => {
      const result = await generateMap('indexedObject');

      expect(result).not.toContain('.entries()');
      expect(result).not.toContain('new Map(');
      expect(result).toContain(
        'for (const [key, value] of Object.entries(this.additionalProperties))'
      );
      expect(result).toContain('instance.additionalProperties = {};');
      expect(result).toContain('obj["tags"] as { [name: string]: string }');
    });
  });
});
