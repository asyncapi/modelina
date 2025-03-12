import { PythonGenerator } from '../../../../src/generators';
import { PYTHON_DATACLASS_PRESET } from '../../../../src/generators/python/presets/PythonDataClassPreset';

describe('PythonDataclassPreset', () => {
  test('should generate a class with @dataclass decorator', async () => {
    const generator = new PythonGenerator({
      presets: [PYTHON_DATACLASS_PRESET]
    });
    const inputModel = {
      name: 'User',
      properties: { name: { type: 'string' }, age: { type: 'integer' } }
    };
    const output = await generator.generate(inputModel);
    expect(output[0].result).toContain('@dataclass');
  });
});
