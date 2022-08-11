import { PythonGenerator } from '../../../src/generators/python';
import { PythonRenderer } from '../../../src/generators/python/PythonRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockPythonRenderer } from '../../TestUtils/TestRenderers';

describe('PythonRenderer', () => {
  let renderer: PythonRenderer<any>;
  beforeEach(() => {
    renderer = new MockPythonRenderer(PythonGenerator.defaultOptions, new PythonGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`"""
someComment
"""`);
    });
    test('Should be able to render multiple comments', () => {
      expect(renderer.renderComments(['someComment', 'someComment'])).toEqual(`"""
someComment
someComment
"""`);
    });
  });
});
