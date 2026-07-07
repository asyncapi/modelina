import { KotlinGenerator, KOTLIN_CONSTRAINTS_PRESET } from '../../../../src';
describe('KOTLIN_CONSTRAINTS_PRESET', () => {
  const doc = {
    $id: 'Clazz',
    type: 'object',
    properties: {
      min_number_prop: { type: 'number', minimum: 0 },
      max_number_prop: { type: 'number', exclusiveMaximum: 100 },
      array_prop: { type: 'array', minItems: 2, maxItems: 3 },
      string_prop: { type: 'string', pattern: '^I_', minLength: 3 }
    },
    required: ['min_number_prop', 'max_number_prop']
  };

  const docWithNested = {
    $id: 'NestedClazz',
    type: 'object',
    properties: {
      array_prop: { type: 'array', items: { type: 'string' } },
      obj_prop: {
        type: 'object',
        $id: 'ObjProp',
        properties: { inner: { type: 'string' } }
      }
    }
  };

  test('should render javax constraints annotations by default', async () => {
    const generator = new KotlinGenerator({
      presets: [KOTLIN_CONSTRAINTS_PRESET]
    });
    const expectedDependencies = [
      'import javax.validation.constraints.*',
      'import javax.validation.Valid'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render javax constraints annotations when configured', async () => {
    const generator = new KotlinGenerator({
      presets: [
        {
          preset: KOTLIN_CONSTRAINTS_PRESET,
          options: {
            useJakarta: false
          }
        }
      ]
    });

    const expectedDependencies = [
      'import javax.validation.constraints.*',
      'import javax.validation.Valid'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render jakarta constraints annotations when configured', async () => {
    const generator = new KotlinGenerator({
      presets: [
        {
          preset: KOTLIN_CONSTRAINTS_PRESET,
          options: {
            useJakarta: true
          }
        }
      ]
    });

    const expectedDependencies = [
      'import jakarta.validation.constraints.*',
      'import jakarta.validation.Valid'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render @Valid for cascade validation on nested object and array properties', async () => {
    const generator = new KotlinGenerator({
      presets: [KOTLIN_CONSTRAINTS_PRESET]
    });

    const models = await generator.generate(docWithNested);
    expect(models.length).toBeGreaterThanOrEqual(1);
    const root = models.find((model) => model.modelName === 'NestedClazz');
    expect(root?.result).toContain('@get:Valid');
    expect(root?.result).toMatchSnapshot();
  });
});
