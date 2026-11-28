/* eslint-disable */

import {
  TypeScriptGenerator,
  TS_COMMON_PRESET
} from '../../../../src/generators';
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

  test('should escape special property keys and additionalProperties keys in marshal/unmarshal', async () => {
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
    const models = await generator.generate({
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'SpecialKeys',
      type: 'object',
      properties: {
        'a"b': { type: 'string' },
        '${key}': { type: 'string' }
      },
      additionalProperties: { oneOf: [{ type: 'string' }, { type: 'number' }] }
    });
    const result = models[0].result;
    expect(result).toContain('json += `"a\\\\"b":');
    expect(result).toContain('json += `"\\${key}":');
    expect(result).toContain('json += `${JSON.stringify(String(key))}:');
    expect(result).toContain('obj["a\\"b"]');
    expect(result).toContain('obj["${key}"]');
  });
});
