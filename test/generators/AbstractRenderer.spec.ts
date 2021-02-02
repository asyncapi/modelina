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
  }

  let renderer: TestRenderer;
  beforeEach(() => {
    renderer = new TestRenderer();
  });

  test('should `renderLine` function works', async function() {
    const content = renderer.renderLine('Test');
    expect(content).toEqual('Test\n');
  });

  test('should `renderBlock` function works', async function() {
    const content = renderer.renderBlock(['Test1', 'Test2']);
    expect(content).toEqual('Test1\nTest2');
  });

  test('should `indent` function works', async function() {
    const content = renderer.indent('Test');
    expect(content).toEqual('  Test');
  });
});
