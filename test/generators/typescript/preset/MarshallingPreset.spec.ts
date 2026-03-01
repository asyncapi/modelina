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
      expect(result).toMatch(/public toJson\(\): Record<string, unknown>\s*\{[\s\S]*?return json;[\s\S]*?\}/);
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

    test('should return null for required date properties, undefined for optional', async () => {
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

      // Required property (createdAt) should use null in unmarshal
      // Pattern: value == null ? null : new Date(value)
      expect(result).toMatch(
        /obj\["createdAt"\]\s*==\s*null\s*\?\s*null\s*:\s*new Date/
      );

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

      // Required non-nullable date should use null in unmarshal
      expect(result).toMatch(
        /obj\["requiredDate"\]\s*==\s*null\s*\?\s*null\s*:\s*new Date/
      );

      // Nullable date properties should use Date conversion
      // Note: The behavior for nullable types (type: ['null', 'string'])
      // depends on how Modelina interprets them - as union types
      expect(result).toContain('new Date(');
    });
  });
});
