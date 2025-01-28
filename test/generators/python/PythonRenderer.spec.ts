import { PythonGenerator } from '../../../src/generators/python';
import { PythonDependencyManager } from '../../../src/generators/python/PythonDependencyManager';
import { PythonRenderer } from '../../../src/generators/python/PythonRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockPythonRenderer } from '../../TestUtils/TestRenderers';

describe('PythonRenderer', () => {
  let renderer: PythonRenderer<any>;
  beforeEach(() => {
    renderer = new MockPythonRenderer(
      PythonGenerator.defaultOptions,
      new PythonGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, {}, '', {}),
      new InputMetaModel(),
      new PythonDependencyManager(PythonGenerator.defaultOptions)
    );
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`"""
someComment
"""`);
    });
    test('Should be able to render multiple comments', () => {
      expect(renderer.renderComments(['someComment', 'someComment']))
        .toEqual(`"""
someComment
someComment
"""`);
    });
  });
});
