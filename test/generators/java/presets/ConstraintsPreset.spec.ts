import {
  JavaGenerator,
  JAVA_CONSTRAINTS_PRESET
} from '../../../../src/generators';

describe('JAVA_CONSTRAINTS_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_CONSTRAINTS_PRESET] });
  });

  test('should render constraints annotations', async () => {
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
    const expectedDependencies = [
      'import java.util.Map;',
      'import javax.validation.constraints.*;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });
});
