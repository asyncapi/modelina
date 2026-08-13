import {
  KotlinGenerator,
  KOTLIN_JACKSON_PRESET
} from '../../../../src/generators';

describe('KOTLIN_JACKSON_PRESET', () => {
  let generator: KotlinGenerator;

  beforeEach(() => {
    generator = new KotlinGenerator({ presets: [KOTLIN_JACKSON_PRESET] });
  });

  test('should render Jackson annotations for class properties', async () => {
    const doc = {
      $id: 'Order',
      type: 'object',
      properties: {
        order_id: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['order_id']
    };

    const models = await generator.generate(doc);

    expect(models).toHaveLength(1);
    expect(models[0].result.replace(/[ \t]+$/gm, '')).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'import com.fasterxml.jackson.annotation.*'
    ]);
  });

  test('should render Jackson serialization and deserialization annotations for enum', async () => {
    const doc = {
      $id: 'OrderStatus',
      type: 'string',
      enum: ['in-progress', 'done']
    };

    const models = await generator.generate(doc);

    expect(models).toHaveLength(1);
    expect(models[0].result.replace(/[ \t]+$/gm, '')).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'import com.fasterxml.jackson.annotation.*'
    ]);
  });

  test('should annotate the default enum value', async () => {
    const doc = {
      $id: 'OrderStatus',
      type: 'string',
      enum: ['in-progress', 'done'],
      default: 'done'
    };

    const models = await generator.generate(doc);

    expect(models[0].result).toContain('@JsonEnumDefaultValue DONE("done")');
  });
});
