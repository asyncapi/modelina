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
      required: ['order_id'],
      additionalProperties: false
    };

    const models = await generator.generate(doc);

    expect(models).toHaveLength(1);
    expect(models[0].result.replace(/[ \t]+$/gm, '')).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([
      'import com.fasterxml.jackson.annotation.JsonProperty',
      'import com.fasterxml.jackson.annotation.JsonInclude'
    ]);
  });

  test('should omit null values for optional nullable and non-nullable properties', async () => {
    const doc = {
      $id: 'Nullability',
      type: 'object',
      properties: {
        optionalNonNullable: { type: 'string' },
        optionalNullable: { type: ['string', 'null'] }
      },
      additionalProperties: false
    };

    const models = await generator.generate(doc);
    const result = models[0].result;

    expect(result).toMatch(
      /@get:JsonProperty\("optionalNonNullable"\)\s+@get:JsonInclude\(JsonInclude.Include.NON_NULL\)/
    );
    expect(result).toMatch(
      /@get:JsonProperty\("optionalNullable"\)\s+@get:JsonInclude\(JsonInclude.Include.NON_NULL\)/
    );
  });

  test('should keep a standalone discriminator property readable', async () => {
    const doc = {
      $id: 'Standalone',
      type: 'object',
      discriminator: 'kind',
      properties: {
        kind: { type: 'string' }
      },
      required: ['kind']
    };

    const models = await generator.generate(doc);

    expect(models[0].result).toContain('@get:JsonProperty("kind")');
    expect(models[0].result).not.toContain('JsonProperty.Access.WRITE_ONLY');
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
      'import com.fasterxml.jackson.annotation.JsonCreator',
      'import com.fasterxml.jackson.annotation.JsonValue'
    ]);
    expect(models[0].result).toContain(
      "Unexpected value '$value' for enum 'OrderStatus'"
    );
  });

  test('should not add Jackson polymorphism annotations to union marker interfaces', async () => {
    const doc = {
      $id: 'Pet',
      discriminator: { propertyName: 'kind' },
      oneOf: [
        {
          $id: 'Dog',
          type: 'object',
          properties: { kind: { const: 'dog' } }
        },
        {
          $id: 'Cat',
          type: 'object',
          properties: { kind: { const: 'cat' } }
        }
      ]
    };

    const models = await generator.generate(doc);
    const union = models.find((model) => model.modelName === 'Pet');

    expect(union?.result).toContain('sealed interface Pet');
    expect(union?.result).not.toContain('@JsonTypeInfo');
    expect(union?.result).not.toContain('@JsonSubTypes');
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
