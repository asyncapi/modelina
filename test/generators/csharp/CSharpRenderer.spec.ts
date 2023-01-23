import { CSharpGenerator } from '../../../src';
import { CSharpDependencyManager } from '../../../src/generators/csharp/CSharpDependencyManager';
import { CSharpRenderer } from '../../../src/generators/csharp/CSharpRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockCSharpRenderer } from '../../TestUtils/TestRenderers';
describe('CSharpRenderer', () => {
  let renderer: CSharpRenderer<any>;
  beforeEach(() => {
    renderer = new MockCSharpRenderer(
      CSharpGenerator.defaultOptions,
      new CSharpGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, '', {}),
      new InputMetaModel(),
      new CSharpDependencyManager(CSharpGenerator.defaultOptions)
    );
  });

  describe('renderComments()', () => {
    test('should render single lines correctly', () => {
      const lines = 'test';
      const renderedLines = renderer.renderComments(lines);
      expect(renderedLines).toMatchSnapshot();
    });
    test('should render multiple lines correctly', () => {
      const lines = ['test', 'test2'];
      const renderedLines = renderer.renderComments(lines);
      expect(renderedLines).toMatchSnapshot();
    });
    test('should render no lines', () => {
      const lines: string[] = [];
      const renderedLines = renderer.renderComments(lines);
      expect(renderedLines).toMatchSnapshot();
    });
  });
});
