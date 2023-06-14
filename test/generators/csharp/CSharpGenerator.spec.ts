import { CSharpGenerator } from '../../../src/generators';

describe('CSharpGenerator', () => {
  let generator: CSharpGenerator;
  beforeEach(() => {
    generator = new CSharpGenerator({ modelType: 'class' });
  });

  test('should render `class` type', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        tuple_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        array_type: { type: 'array', items: { type: 'string' } }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'using System.Collections.Generic;'
    ]);
  });

  test('should render null-forgiving operator if handleNullable is chosen', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        house_type: {
          type: 'string',
          enum: ['apartment', 'house', 'condo'],
          description: 'Type of house'
        },
        terrace_type: {
          type: 'string',
          enum: ['wood', 'concrete', 'brick'],
          description: 'Type of terrace'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        tuple_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        array_type: { type: 'array', items: { type: 'string' } }
      },
      required: [
        'street_name',
        'city',
        'state',
        'house_number',
        'array_type',
        'house_type'
      ],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      }
    };

    generator.options.handleNullable = true;
    const models = await generator.generate(doc);
    expect(models).toHaveLength(3);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'using System.Collections.Generic;'
    ]);
  });

  test('should render `record` type if chosen', async () => {
    const doc = {
      $id: '_address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        tuple_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        array_type: { type: 'array', items: { type: 'string' } }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type'],
      additionalProperties: {
        type: 'string'
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      }
    };

    generator.options.modelType = 'record';
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'using System.Collections.Generic;'
    ]);
  });

  test('should render `enum` type', async () => {
    const doc = {
      $id: 'Things',
      enum: ['Texas', '1', 1, false, { test: 'test' }]
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render enums with translated special characters', async () => {
    const doc = {
      $id: 'States',
      type: 'string',
      enum: ['test+', 'test', 'test-', 'test?!', '*test']
    };

    generator = new CSharpGenerator();

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should render models and their dependencies', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        array_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        },
        other_model: {
          type: 'object',
          $id: 'OtherModel',
          properties: { street_name: { type: 'string' } }
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const config = { namespace: 'Test.Namespace' };
    const models = await generator.generateCompleteModels(doc, config);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });

  test('should throw error when reserved keyword is used for package name', async () => {
    const doc = {
      $id: 'Address',
      type: 'object',
      properties: {
        street_name: { type: 'string' },
        city: { type: 'string', description: 'City description' },
        state: { type: 'string' },
        house_number: { type: 'number' },
        marriage: {
          type: 'boolean',
          description: 'Status if marriage live in given house'
        },
        members: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }]
        },
        array_type: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }]
        }
      },
      patternProperties: {
        '^S(.?*)test&': {
          type: 'string'
        }
      },
      required: ['street_name', 'city', 'state', 'house_number', 'array_type']
    };
    const config = { namespace: 'true' };
    const expectedError = new Error(
      'You cannot use reserved CSharp keyword (true) as namespace, please use another.'
    );
    await expect(generator.generateCompleteModels(doc, config)).rejects.toEqual(
      expectedError
    );
  });

  describe('class renderer', () => {
    const doc = {
      $id: 'CustomClass',
      type: 'object',
      properties: {
        property: { type: 'string' }
      },
      additionalProperties: {
        type: 'string'
      }
    };

    test('should be able to overwrite accessor preset hook', async () => {
      generator = new CSharpGenerator({
        presets: [
          {
            class: {
              accessor() {
                return 'my own custom factory';
              }
            }
          }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'using System.Collections.Generic;'
      ]);
    });

    test('should be able to overwrite property preset hook', async () => {
      generator = new CSharpGenerator({
        presets: [
          {
            class: {
              property() {
                return 'my own property';
              }
            }
          }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual([
        'using System.Collections.Generic;'
      ]);
    });
  });
});
