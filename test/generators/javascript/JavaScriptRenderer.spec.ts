import { JavaScriptGenerator } from '../../../src/generators';
import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockJavaScriptRenderer } from '../../TestUtils/TestRenderers';

describe('JavaScriptRenderer', () => {
  let renderer: JavaScriptRenderer<any>;
  beforeEach(() => {
    renderer = new MockJavaScriptRenderer(JavaScriptGenerator.defaultOptions, new JavaScriptGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
