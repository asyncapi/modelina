import { PythonGenerator } from '../../../../src/generators';
import { PYTHON_ATTRS_PRESET } from '../../../../src/generators/python/presets/PythonAttrsPreset';

describe('PythonAttrsPreset', () => {
  test('should generate a class with @attr.s decorator', async () => {
    const generator = new PythonGenerator({ presets: [PYTHON_ATTRS_PRESET] });
    const inputModel = {
      name: 'User',
      properties: { name: { type: 'string' }, age: { type: 'integer' } }
    };
    const output = await generator.generate(inputModel);
    expect(output[0].result).toContain('@attr.s(auto_attribs=True)');

  });
});