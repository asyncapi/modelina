import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators';

describe('JAVA_JACKSON_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' }
      }
    };
    const expectedDependencies = [
      'import java.util.Map;',
      'import com.fasterxml.jackson.annotation.*;'
    ];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render Jackson annotations for enum', async () => {
    const doc = {
      $id: 'Enum',
      type: 'string',
      description: 'Description for enum',
      examples: ['value'],
      enum: ['on', 'off']
    };

    const expectedDependencies = ['import com.fasterxml.jackson.annotation.*;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render Jackson annotations for discriminated union', async () => {
    const doc = {
      $id: 'Union',
      type: 'object',
      discriminator: 'union_case',
      oneOf: [
        {
          type: 'object',
          $id: 'A',
          properties: {
            union_case: { type: 'string' },
            prop_a: { type: 'number' }
          }
        },
        {
          type: 'object',
          $id: 'B',
          properties: {
            union_case: { type: 'string' },
            prop_b: { type: 'string' }
          }
        }
      ]
    };
    const expectedDependency = 'import com.fasterxml.jackson.annotation.*;';
    const models = await generator.generate(doc);
    expect(models).toHaveLength(3);
    expect(models[0].result).toContain('JsonTypeInfo.Id.NAME');
    expect(models.map((m) => m.result)).toMatchSnapshot();
    expect(models[0].dependencies).toContain(expectedDependency);
    expect(models[1].dependencies).toContain(expectedDependency);
    expect(models[2].dependencies).toContain(expectedDependency);
  });

  test('should render Jackson annotations for deduced union', async () => {
    const doc = {
      $id: 'Union',
      type: 'object',
      oneOf: [
        {
          type: 'object',
          $id: 'A',
          properties: {
            prop_a: { type: 'number' }
          }
        },
        {
          type: 'object',
          $id: 'B',
          properties: {
            prop_b: { type: 'string' }
          }
        }
      ]
    };
    const expectedDependency = 'import com.fasterxml.jackson.annotation.*;';
    const models = await generator.generate(doc);
    expect(models).toHaveLength(3);
    expect(models[0].result).toContain('JsonTypeInfo.Id.DEDUCTION');
    expect(models.map((m) => m.result)).toMatchSnapshot();
    expect(models[0].dependencies).toContain(expectedDependency);
    expect(models[1].dependencies).toContain(expectedDependency);
    expect(models[2].dependencies).toContain(expectedDependency);
  });
});
