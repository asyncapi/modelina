import { KotlinGenerator } from '../../../src/generators/kotlin';
import { KotlinRenderer } from '../../../src/generators/kotlin/KotlinRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockKotlinRenderer } from '../../TestUtils/TestRenderers';

describe('KotlinRenderer', () => {
  let renderer: KotlinRenderer<any>;
  beforeEach(() => {
    renderer = new MockKotlinRenderer(
      KotlinGenerator.defaultOptions,
      new KotlinGenerator(),
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
      expect(renderer.renderAnnotation('someComment')).toEqual('@SomeComment');
    });
    test('Should be able to render multiple values', () => {
      expect(
        renderer.renderAnnotation('someComment', { test: 1, cool: '"story"' })
      ).toEqual('@SomeComment(test=1, cool="story")');
    });
    test('Should be able to render one value', () => {
      expect(
        renderer.renderAnnotation('someComment', { test: '"test2"' })
      ).toEqual('@SomeComment(test="test2")');
    });
    test('Should be able to use different prefixes', () => {
      expect(renderer.renderAnnotation('someComment', null, 'get:')).toEqual(
        '@get:SomeComment'
      );
      expect(renderer.renderAnnotation('someComment', null, 'field:')).toEqual(
        '@field:SomeComment'
      );
      expect(renderer.renderAnnotation('someComment', null, 'param:')).toEqual(
        '@param:SomeComment'
      );
    });
  });
});
