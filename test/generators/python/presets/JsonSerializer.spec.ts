import {
  PythonGenerator,
  PYTHON_JSON_SERIALIZER_PRESET
} from '../../../../src/generators/python';

describe('PYTHON_JSON_SERIALIZER_PRESET', () => {
  let generator: PythonGenerator;

  beforeEach(() => {
    generator = new PythonGenerator({
      presets: [PYTHON_JSON_SERIALIZER_PRESET]
    });
  });

  test('should render serializer and deserializer for class', async () => {
    const doc = {
      $id: 'Test',
      type: 'object',
      properties: {
        prop: {
          type: 'string'
        }
      }
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
