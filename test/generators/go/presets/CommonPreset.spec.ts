import {
  GoGenerator,
  GO_COMMON_PRESET,
  GoCommonPresetOptions
} from '../../../../src/generators';

describe('GO_COMMON_PRESET', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    const options: GoCommonPresetOptions = {
      addJsonTag: true,
      addOmitEmpty: true
    };
    generator = new GoGenerator({
      presets: [{ preset: GO_COMMON_PRESET, options }]
    });
  });

  test('should render json tags for structs', async () => {
    const doc = {
      type: 'object',
      properties: {
        stringProp: { type: 'string' },
        numberProp: { type: 'number' },
        booleanProp: { type: 'boolean' }
      },
      additionalProperties: false
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should render the marshal functions for enum', async () => {
    const doc = {
      type: 'string',
      enum: ['2.6.0']
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
