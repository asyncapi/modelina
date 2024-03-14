import { PythonGenerator } from '../../../src/generators/python';

describe('PythonGenerator', () => {
  let generator: PythonGenerator;
  beforeEach(() => {
    generator = new PythonGenerator();
  });

  describe('Enum', () => {
    test('should render `enum` with mixed types (union type)', async () => {
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

      generator = new PythonGenerator({
        presets: [
          {
            enum: {
              self({ content }) {
                return content;
              }
            }
          }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render enums with translated special characters', async () => {
      const doc = {
        $id: 'States',
        enum: ['test+', '$test', 'test-', 'test?!', '*test']
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
  });
  describe('Class', () => {
    test('should not render reserved keyword', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          del: { type: 'string' },
          reservedDel: { type: 'string' }
        },
        additionalProperties: false
      };

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render constant types', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          street_name: { type: 'string', const: 'someAddress' }
        },
        additionalProperties: false
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should handle self reference models', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          self_model: { $ref: '#' },
          array_model: { type: 'array', items: { $ref: '#' } },
          tuple_model: {
            type: 'array',
            items: [{ $ref: '#' }],
            additionalItems: false
          },
          map_model: {
            type: 'object',
            additionalProperties: {
              $ref: '#'
            }
          },
          union_model: {
            oneOf: [{ $ref: '#' }]
          }
        },
        additionalProperties: false
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should render `class` type', async () => {
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
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should work with custom preset for `class` type', async () => {
      const doc = {
        $id: 'CustomClass',
        type: 'object',
        properties: {
          property: { type: 'string' }
        }
      };
      generator = new PythonGenerator({
        presets: [
          {
            class: {
              property({ content }) {
                const annotation = 'test1';
                return `${annotation}\n${content}`;
              },
              getter({ content }) {
                const annotation = 'test2';
                return `${annotation}\n${content}`;
              },
              setter({ content }) {
                const annotation = 'test3';
                return `${annotation}\n${content}`;
              }
            }
          }
        ]
      });

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
    test('should work with empty objects', async () => {
      const doc = {
        $id: 'CustomClass',
        type: 'object',
        additionalProperties: false
      };
      generator = new PythonGenerator();

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });
  });
});
