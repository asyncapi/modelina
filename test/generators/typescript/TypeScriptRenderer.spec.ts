import { defaultGeneratorOptions, TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { MockTypeScriptRenderer } from '../../TestUtils/TestRenderers';

describe('TypeScriptRenderer', () => {
  let renderer: TypeScriptRenderer;
  beforeEach(() => {
    renderer = new MockTypeScriptRenderer()
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
