import { JavaScriptGenerator } from '../../../src/generators'; 
import { JavaScriptRenderer } from '../../../src/generators/javascript/JavaScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';

describe('JavaScriptRenderer', function() {
  class MockJavaScriptRenderer extends JavaScriptRenderer {}

  let renderer: JavaScriptRenderer;
  beforeEach(() => {
    renderer = new MockJavaScriptRenderer({}, new JavaScriptGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('renderComments()', function() {
    test('Should be able to render comments', function() {
      expect(renderer.renderComments("someComment")).toEqual(`/**
 * someComment
 */`);
    });
  });
});
