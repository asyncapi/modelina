import { ScalaGenerator } from '../../../src/generators/scala';
import { ScalaRenderer } from '../../../src/generators/scala/ScalaRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockScalaRenderer } from '../../TestUtils/TestRenderers';

describe('ScalaRenderer', () => {
  let renderer: ScalaRenderer<any>;
  beforeEach(() => {
    renderer = new MockScalaRenderer(
      ScalaGenerator.defaultOptions,
      new ScalaGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel()
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
    test('Should render', () => {
      expect(renderer.renderAnnotation('someComment')).toEqual('@someComment');
    });
    test('Should be able to render multiple values', () => {
      expect(
        renderer.renderAnnotation('someComment', { test: 1, cool: '"story"' })
      ).toEqual('@someComment(test=1, cool="story")');
    });
    test('Should be able to render one value', () => {
      expect(
        renderer.renderAnnotation('someComment', { test: '"test2"' })
      ).toEqual('@someComment(test="test2")');
    });
  });
});
