import { JavaGenerator } from '../../../src/generators';
import { JavaRenderer } from '../../../src/generators/java/JavaRenderer';
import { CommonModel, ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockJavaRenderer } from '../../TestUtils/TestRenderers';

describe('JavaRenderer', () => {
  let renderer: JavaRenderer<any>;
  beforeEach(() => {
    renderer = new MockJavaRenderer(JavaGenerator.defaultOptions, new JavaGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
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
