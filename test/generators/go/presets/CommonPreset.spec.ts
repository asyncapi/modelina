import {
  GoGenerator,
  GO_COMMON_PRESET,
  GoCommonPresetOptions
} from '../../../../src/generators';

describe('Go_COMMON_PRESET', () => {
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator({
      presets: [{ preset: GO_COMMON_PRESET, options: { addJsonTag: true } }]
    });
  });
  test('');
});
