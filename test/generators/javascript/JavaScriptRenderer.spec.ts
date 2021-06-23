import { JavaScriptGenerator } from '../../../src/generators';
import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockJavaScriptRenderer extends JavaScriptRenderer {

}
describe('JavaScriptRenderer', () => {
  let renderer: JavaScriptRenderer;
  beforeEach(() => {
    renderer = new MockJavaScriptRenderer(JavaScriptGenerator.defaultOptions, new JavaScriptGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
