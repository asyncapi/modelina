import { GoGenerator } from '../../../src/generators';

describe('GoGenerator', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator();
  });
  test('should render `struct` type', async () => {
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
  });

  test('should work custom preset for `struct` type', async () => {
    const doc = {
      $id: 'CustomStruct',
      type: 'object',
      properties: {
        property: { type: 'string' }
      },
      additionalProperties: {
        type: 'string'
      }
    };
    generator = new GoGenerator({
      presets: [
        {
          struct: {
            field({ field }) {
              return `field ${field.propertyName}`;
            },
            additionalContent() {
              return 'additionalContent';
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render `enum` with mixed types', async () => {
    const doc = {
      $id: 'Things',
      enum: ['Texas', 1, '1', false, { test: 'test' }]
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should work custom preset for `enum` type', async () => {
    const doc = {
      $id: 'CustomEnum',
      type: 'string',
      enum: ['Texas', 'Alabama', 'California']
    };

    generator = new GoGenerator({
      presets: [
        {
          enum: {
            item({ index }) {
              return `test ${index}`;
            },
            additionalContent() {
              return 'additionalContent';
            }
          }
        }
      ]
    });

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
  describe('generateCompleteModels()', () => {
    test('should render models', async () => {
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
      const config = { packageName: 'some_package' };
      const models = await generator.generateCompleteModels(doc, config);
      expect(models).toHaveLength(2);
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
    });

    test('should render dependencies', async () => {
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
      generator = new GoGenerator({
        presets: [
          {
            struct: {
              self({ renderer, content }) {
                renderer.dependencyManager.addDependency('time');
                return content;
              }
            }
          }
        ]
      });
      const config = { packageName: 'some_package' };
      const models = await generator.generateCompleteModels(doc, config);
      expect(models).toHaveLength(2);
      expect(models[0].result).toMatchSnapshot();
      expect(models[1].result).toMatchSnapshot();
      expect(models[0].dependencies).toEqual(['time']);
      expect(models[1].dependencies).toEqual(['time']);
    });
  });
});
