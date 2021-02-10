import { AbstractRenderer } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';

describe('AbstractRenderer', function() {
  class TestRenderer extends AbstractRenderer {
    constructor() {
      super({
        indentation: {
          type: IndentationTypes.SPACES,
          size: 2,
        },
      });
    }
    render() { return "" }
  }

  let renderer: TestRenderer;
  beforeEach(() => {
    renderer = new TestRenderer();
  });

  test('renderLine function should render string with new line', async function() {
    const content = renderer.renderLine('Test');
    expect(content).toEqual('Test\n');
  });

  test('renderBlock function should render multiple lines', async function() {
    const content = renderer.renderBlock(['Test1', 'Test2']);
    expect(content).toEqual('Test1\nTest2');
  });

  test('indent function should render text with indentation', async function() {
    const content = renderer.indent('Test');
    expect(content).toEqual('  Test');
  });
});
