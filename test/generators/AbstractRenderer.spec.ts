import { AbstractRenderer } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { CommonInputModel, CommonModel } from '../../src/models';

describe('AbstractRenderer', () => {
  class TestRenderer extends AbstractRenderer {
    constructor() {
      super({
        indentation: {
          type: IndentationTypes.SPACES,
          size: 2,
        },
      }, [], new CommonModel(), new CommonInputModel());
    }
    render() { return ''; }
  }

  let renderer: TestRenderer;
  beforeEach(() => {
    renderer = new TestRenderer();
  });

  test('renderLine function should render string with new line', () => {
    const content = renderer.renderLine('Test');
    expect(content).toEqual('Test\n');
  });

  test('renderBlock function should render multiple lines', () => {
    const content = renderer.renderBlock(['Test1', 'Test2']);
    expect(content).toEqual('Test1\nTest2');
  });

  describe('addDependency()', () => {
    test('should add dependency', () => {
      renderer.addDependency('test');
      expect(renderer.dependencies).toEqual(['test']);
    });
    test('should not add duplicate dependency', () => {
      renderer.addDependency('test');
      renderer.addDependency('test');
      expect(renderer.dependencies).toEqual(['test']);
    });
  });
  describe('indent()', () => {
    test('should render text with indentation', () => {
      const content = renderer.indent('Test');
      expect(content).toEqual('  Test');
    });
    test('should render indentation  with options', () => {
      const content = renderer.indent('Test', 4, IndentationTypes.SPACES);
      expect(content).toEqual('    Test');
    });
  });
});
