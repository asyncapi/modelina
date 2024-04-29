import { JavaGenerator } from '../../../src/generators';
import { JavaDependencyManager } from '../../../src/generators/java/JavaDependencyManager';
import { JavaRenderer } from '../../../src/generators/java/JavaRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockJavaRenderer } from '../../TestUtils/TestRenderers';

describe('JavaRenderer', () => {
  let renderer: JavaRenderer<any>;
  beforeEach(() => {
    renderer = new MockJavaRenderer(
      JavaGenerator.defaultOptions,
      new JavaGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, {}, '', {}),
      new InputMetaModel(),
      new JavaDependencyManager(JavaGenerator.defaultOptions)
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

  describe('renderStringLiteral()', () => {
    test('Should be able to render string literal with special characters', () => {
      expect(
        renderer.renderStringLiteral(
          'this is a "literal" string with \'special\' characters: \\a\n\t\\b'
        )
      ).toEqual(
        '"this is a \\"literal\\" string with \'special\' characters: \\\\a\\n\\t\\\\b"'
      );
    });
  });
});
