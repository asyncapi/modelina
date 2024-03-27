import { GoDependencyManager } from '../../../src/generators/go/GoDependencyManager';
import { GoGenerator } from '../../../src/generators/go/GoGenerator';
import { GoRenderer } from '../../../src/generators/go/GoRenderer';
import { ConstrainedObjectModel, InputMetaModel } from '../../../src/models';
import { MockGoRenderer } from '../../TestUtils/TestRenderers';

describe('GoRenderer', () => {
  let renderer: GoRenderer<any>;
  beforeEach(() => {
    renderer = new MockGoRenderer(
      GoGenerator.defaultOptions,
      new GoGenerator(),
      [],
      new ConstrainedObjectModel('', undefined, {}, '', {}),
      new InputMetaModel(),
      new GoDependencyManager(GoGenerator.defaultOptions)
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
