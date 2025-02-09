import {
  JavaGenerator,
  JAVA_CONSTRAINTS_PRESET
} from '../../../../src/generators';

describe('JAVA_CONSTRAINTS_PRESET', () => {
  const doc = {
    $id: 'Clazz',
    type: 'object',
    properties: {
      min_number_prop: { type: 'number', minimum: 0 },
      max_number_prop: { type: 'number', exclusiveMaximum: 100 },
      array_prop: { type: 'array', minItems: 2, maxItems: 3 },
      string_prop: {
        type: 'string',
        pattern: '^\\w+("\\.\\w+)*$',
        minLength: 3
      }
    },
    required: ['min_number_prop', 'max_number_prop']
  };

  test('should render javax constraints annotations by default', async () => {
    const generator = new JavaGenerator({ presets: [JAVA_CONSTRAINTS_PRESET] });
    const expectedDependencies = [
      'import java.util.Map;',
      'import javax.validation.constraints.*;',
      'import javax.validation.Valid;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render javax constraints annotations when configured', async () => {
    const generator = new JavaGenerator({
      presets: [
        {
          preset: JAVA_CONSTRAINTS_PRESET,
          options: {
            useJakarta: false
          }
        }
      ]
    });
    const expectedDependencies = [
      'import java.util.Map;',
      'import javax.validation.constraints.*;',
      'import javax.validation.Valid;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render jakarta constraints annotations from when configured', async () => {
    const generator = new JavaGenerator({
      presets: [
        {
          preset: JAVA_CONSTRAINTS_PRESET,
          options: {
            useJakarta: true
          }
        }
      ]
    });
    const expectedDependencies = [
      'import java.util.Map;',
      'import jakarta.validation.constraints.*;',
      'import jakarta.validation.Valid;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should not render anything when isExtended is true', async () => {
    const extend = {
      $id: 'extend',
      type: 'object',
      properties: {
        extendProp: {
          type: 'string'
        }
      },
      required: ['extendProp']
    };
    const extendDoc = {
      $id: 'extendDoc',
      allOf: [extend]
    };
    const generator = new JavaGenerator({
      presets: [JAVA_CONSTRAINTS_PRESET],
      processorOptions: {
        interpreter: {
          allowInheritance: true
        }
      }
    });
    const models = await generator.generate(extendDoc);
    expect(models).toHaveLength(2);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });
});
