import { PhpGenerator } from '../../../src';
import { PhpRenderer } from '../../../src/generators/php/PhpRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src';
import { MockPhpRenderer } from '../../TestUtils/TestRenderers';

describe('PhpRenderer', () => {
  let renderer: PhpRenderer<any>;
  beforeEach(() => {
    renderer = new MockPhpRenderer(PhpGenerator.defaultOptions, new PhpGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });
});
