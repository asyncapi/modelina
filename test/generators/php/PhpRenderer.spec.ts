import { PhpGenerator } from '../../../src/generators/php';
import { PhpRenderer } from '../../../src/generators/php/PhpRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockPhpRenderer } from '../../TestUtils/TestRenderers';
import { PhpDependencyManager } from '../../../src/generators/php/PhpDependencyManager';

describe('PhpRenderer', () => {
  let renderer: PhpRenderer<any>;
  beforeEach(() => {
    renderer = new MockPhpRenderer(
      PhpGenerator.defaultOptions,
      new PhpGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, {}, '', {}),
      new InputMetaModel(),
      new PhpDependencyManager(PhpGenerator.defaultOptions)
    );
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual('* someComment');
    });
  });
});
