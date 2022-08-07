import { TemplateGenerator } from '../../../src/generators/template';

describe('TemplateGenerator', () => {
  let generator: TemplateGenerator;
  beforeEach(() => {
    generator = new TemplateGenerator();
  });

  describe('Enum', () => {
    test('should not render reserved keyword', async () => {
      const doc = {
        $id: 'Address',
        type: 'object',
        properties: {
          enum: { type: 'string' },
          reservedEnum: { type: 'string' }
        },
        additionalProperties: false
      };

      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should render `enum` with mixed types (union type)', async () => {
      const doc = {
        $id: 'Things',
        enum: ['Texas', 1, '1', false, { test: 'test' }],
      };
      const models = await generator.generate(doc);
      expect(models).toHaveLength(1);
      expect(models[0].result).toMatchSnapshot();
    });

    test('should work custom preset for `enum` type', async () => {
      const doc = {
        $id: 'CustomEnum',
        type: 'string',
        enum: ['Texas', 'Alabama', 'California'],
      };

      generator = new TemplateGenerator({
        presets: [
          {
            enum: {
              self({ content }) {
                return content;
              },
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
});
