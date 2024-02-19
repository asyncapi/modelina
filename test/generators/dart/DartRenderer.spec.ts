import { DartGenerator } from '../../../src/generators';
import { DartDependencyManager } from '../../../src/generators/dart/DartDependencyManager';
import { DartRenderer } from '../../../src/generators/dart/DartRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
class MockDartRenderer extends DartRenderer<ConstrainedObjectModel> {}
describe('DartRenderer', () => {
  let renderer: DartRenderer<any>;
  beforeEach(() => {
    renderer = new MockDartRenderer(
      DartGenerator.defaultOptions,
      new DartGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel(),
      new DartDependencyManager(DartGenerator.defaultOptions)
    );
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
      expect(
        renderer.renderAnnotation('someComment', { test: 'test2' })
      ).toEqual('@SomeComment(test=test2)');
    });
  });
});
