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
      expect(result).toContain('new Date(obj["createdAt"])');

      // Should use new Date() conversion for date format
      expect(result).toContain('new Date(obj["birthDate"])');

      // Should use new Date() conversion for time format
      expect(result).toContain('new Date(obj["meetingTime"])');

      // Should NOT use new Date() for regular strings
      expect(result).not.toContain('new Date(obj["regularString"])');

      // Snapshot for full verification
      expect(result).toMatchSnapshot();
    });

    test('should handle null/undefined values for date properties', async () => {
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

      // Should include null safety check for date conversion
      // Pattern: value == null ? null : new Date(value)
      expect(result).toMatch(/obj\["createdAt"\]\s*==\s*null\s*\?\s*null\s*:\s*new Date/);
    });
  });
});
