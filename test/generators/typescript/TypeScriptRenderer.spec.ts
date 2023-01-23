import { ConstrainedObjectModel, InputMetaModel } from '../../../src';
import { TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { MockTypeScriptRenderer } from '../../TestUtils/TestRenderers';
describe('TypeScriptRenderer', () => {
  let renderer: TypeScriptRenderer<any>;
  beforeEach(() => {
    renderer = new MockTypeScriptRenderer(
      TypeScriptGenerator.defaultOptions,
      new TypeScriptGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel()
    );
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
