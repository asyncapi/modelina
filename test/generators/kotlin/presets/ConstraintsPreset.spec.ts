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

  test('should render javax constraints annotations by default', async () => {
    const generator = new KotlinGenerator({
      presets: [KOTLIN_CONSTRAINTS_PRESET]
    });
    const expectedDependencies = ['import javax.validation.constraints.*'];

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

    const expectedDependencies = ['import javax.validation.constraints.*'];

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

    const expectedDependencies = ['import jakarta.validation.constraints.*'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });
});
