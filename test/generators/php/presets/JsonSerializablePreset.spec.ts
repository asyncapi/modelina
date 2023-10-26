import { PHP_JSON_SERIALIZABLE_PRESET, PhpGenerator } from '../../../../src';

describe('PHP_JSON_SERIALIZABLE_PRESET', () => {
  let generator: PhpGenerator;
  beforeEach(() => {
    generator = new PhpGenerator({
      presets: [PHP_JSON_SERIALIZABLE_PRESET]
    });
  });

  test('should render jsonSerialize method for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        prop: {
          type: 'string'
        },
        'prop-with-dash': {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render jsonSerialize method for enum', async () => {
    const doc = {
      $id: 'Enumm',
      type: 'enum',
      enum: ['value-A', 'value-B']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render jsonSerialize method for enum with mixed types', async () => {
    const doc = {
      $id: 'Enumm',
      type: 'enum',
      enum: [1, 'B']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
