import { JavaGenerator } from '../../../../src/generators';
import { EnumRenderer } from '../../../../src/generators/java/renderers/EnumRenderer';
import { CommonInputModel, CommonModel } from '../../../../src/models';

describe('EnumRenderer', () => {
  let renderer: EnumRenderer;
  beforeEach(() => {
    renderer = new EnumRenderer(JavaGenerator.defaultOptions, new JavaGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('normalizeKey()', () => {
    test('should correctly format " " to correct key', () => {
      const key = renderer.normalizeKey('something something');
      expect(key).toEqual('SOMETHING_SOMETHING');
    });
    test('should correctly format "_" to correct key', () => {
      const key = renderer.normalizeKey('something_something');
      expect(key).toEqual('SOMETHING_SOMETHING');
    });
  });
});
