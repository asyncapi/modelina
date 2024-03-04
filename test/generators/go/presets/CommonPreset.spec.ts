import {
  GoGenerator,
  GO_COMMON_PRESET,
  GoCommonPresetOptions
} from '../../../../src/generators';

describe('GO_COMMON_PRESET', () => {
  const enumDoc = {
    type: 'string',
    enum: ['2.6.0']
  };

  const structDoc = {
    type: 'object',
    properties: {
      stringProp: { type: 'string' },
      numberProp: { type: 'number' },
      booleanProp: { type: 'boolean' }
    }
  };

  test('should render json tags for structs', async () => {
    const options: GoCommonPresetOptions = { addJsonTag: true };
    const generator = new GoGenerator({
      presets: [{ preset: GO_COMMON_PRESET, options }]
    });
    const models = await generator.generate(structDoc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render the marshal functions for enum', async () => {
    const options: GoCommonPresetOptions = { addJsonTag: true };
    const generator = new GoGenerator({
      presets: [{ preset: GO_COMMON_PRESET, options }]
    });
    const models = await generator.generate(enumDoc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
