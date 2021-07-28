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
    test('should render reserved type keyword correctly', () => {
      const name = renderer.nameType('enum');
      expect(name).toEqual('ReservedEnum');
    });
  });
  
  describe('nameProperty()', () => {
    test('should name the property', () => {
      const name = renderer.nameProperty('property__someProperty');
      expect(name).toEqual('propertySomeProperty');
    });
    test('should render reserved property keyword correctly', () => {
      const name = renderer.nameProperty('enum');
      expect(name).toEqual('reservedEnum');
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
