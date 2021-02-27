import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockJavaScriptRenderer extends JavaScriptRenderer {

}
describe('JavaScriptRenderer', function() {
  let renderer: JavaScriptRenderer;
  beforeEach(() => {
    renderer = new MockJavaScriptRenderer({}, [], new CommonModel(), new CommonInputModel());
  });

  describe('renderComments()', function() {
    test('Should be able to render comments', function() {
      expect(renderer.renderComments("someComment")).toEqual(`/**
 * someComment
 */`);
    });
  });
});
