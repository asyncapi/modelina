import { JavaScriptGenerator } from '../../../src/generators';
import { JavaScriptDependencyManager } from '../../../src/generators/javascript/JavaScriptDependencyManager';
import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockJavaScriptRenderer } from '../../TestUtils/TestRenderers';

describe('JavaScriptRenderer', () => {
  let renderer: JavaScriptRenderer<any>;
  beforeEach(() => {
    renderer = new MockJavaScriptRenderer(
      JavaScriptGenerator.defaultOptions,
      new JavaScriptGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel(),
      new JavaScriptDependencyManager(JavaScriptGenerator.defaultOptions)
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
