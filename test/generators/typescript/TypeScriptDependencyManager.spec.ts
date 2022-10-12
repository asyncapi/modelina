import { ConstrainedObjectModel, InputMetaModel } from '../../../src';
import { TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { MockTypeScriptRenderer } from '../../TestUtils/TestRenderers';
describe('TypeScriptDependencyManager', () => {
  describe('renderDependency()', () => {
    test('Should be able to render dependency', () => {
      expect(renderer.renderDependency('someComment', 'someComment2')).toEqual('import someComment from \'someComment2\';');
    });
  });
});
