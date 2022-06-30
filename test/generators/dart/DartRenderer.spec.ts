import { defaultGeneratorOptions, DartGenerator } from '../../../src/generators';
import { DartRenderer } from '../../../src/generators/dart/DartRenderer';
import { CommonInputModel, CommonModel, ConstrainedObjectModel } from '../../../src/models';
class MockDartRenderer extends DartRenderer<ConstrainedObjectModel> {

}
describe('DartRenderer', () => {
  let renderer: DartRenderer;
  beforeEach(() => {
    renderer = new MockDartRenderer(DartGenerator.defaultOptions, new DartGenerator(), [], new CommonModel(), new CommonInputModel());
  });
  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });

  describe('renderAnnotation()', () => {
    test('Should be able to render multiple annotations', () => {
      expect(renderer.renderAnnotation('someComment', {test: 'test2'})).toEqual('@SomeComment(test=test2)');
    });
  });
});
