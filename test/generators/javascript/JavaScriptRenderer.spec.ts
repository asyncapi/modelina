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

  describe('nameType()', () => {
    test('should name the type', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
  });
  
  describe('nameProperty()', () => {
    test('should name the property', () => {
      const name = renderer.nameProperty('property__someProperty');
      expect(name).toEqual('propertySomeProperty');
    });
  });
  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
