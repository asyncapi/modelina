import { JavaGenerator } from '../../../src/generators';
import { JavaRenderer } from '../../../src/generators/java/JavaRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
import { MockJavaRenderer } from '../../TestUtils/TestRenderers';

describe('JavaRenderer', () => {
  let renderer: JavaRenderer;
  beforeEach(() => {
    renderer = new MockJavaRenderer(JavaGenerator.defaultOptions, new JavaGenerator(), [], new CommonModel(), new CommonInputModel());
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
