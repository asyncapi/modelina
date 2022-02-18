import { TypeScriptGenerator } from '../../../../src/generators';
import { EnumRenderer } from '../../../../src/generators/typescript/renderers/EnumRenderer';
import { InputMetaModel, CommonModel } from '../../../../src/models';

describe('EnumRenderer', () => {
  let renderer: EnumRenderer;
  beforeEach(() => {
    renderer = new EnumRenderer(TypeScriptGenerator.defaultOptions, new TypeScriptGenerator(), [], new CommonModel(), new InputMetaModel());
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
