import { CppGenerator } from '../../../src/generators/cpp';
import { CppRenderer } from '../../../src/generators/cpp/CppRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockCppRenderer } from '../../TestUtils/TestRenderers';

describe('CppRenderer', () => {
  let renderer: CppRenderer<any>;
  beforeEach(() => {
    renderer = new MockCppRenderer(CppGenerator.defaultOptions, new CppGenerator(), [], new ConstrainedObjectModel('', undefined, '', {}), new InputMetaModel());
  });

describe('renderComments()', () => {
  test('Should be able to render comments', () => {
    expect(renderer.renderComments('someComment')).toEqual('// someComment');
    });
  });
});
