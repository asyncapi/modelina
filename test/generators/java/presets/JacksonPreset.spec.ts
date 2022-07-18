import { JavaGenerator, JAVA_JACKSON_PRESET } from '../../../../src/generators'; 

describe('JAVA_JACKSON_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_JACKSON_PRESET] });
  });

  test('should render Jackson annotations', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      properties: {
        min_number_prop: { type: 'number' },
        max_number_prop: { type: 'number' },
      },
    };
    const expectedDependencies = ['import java.util.Map;', 'import com.fasterxml.jackson.annotation.*;'];

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot(); 
    expect(models[0].dependencies).toEqual(expectedDependencies); 
  });
});
