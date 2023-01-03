import { KotlinGenerator } from '../../../src/generators/kotlin';
import { KotlinRenderer } from '../../../src/generators/kotlin/KotlinRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockKotlinRenderer } from '../../TestUtils/TestRenderers';

describe('KotlinRenderer', () => {
  let renderer: KotlinRenderer<any>;
  beforeEach(() => {
    renderer = new MockKotlinRenderer(KotlinGenerator.defaultOptions, new KotlinGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
