import { AbstractRenderer } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { CommonInputModel, CommonModel, RenderOutput } from '../../src/models';
import { testOptions, TestGenerator } from './AbstractGenerator.spec';

describe('AbstractRenderer', () => {
  class TestRenderer extends AbstractRenderer {
    constructor() {
      super(testOptions, new TestGenerator(), [], new CommonModel(), new CommonInputModel());
    }
    render(): Promise<RenderOutput> {
      return Promise.resolve(RenderOutput.toRenderOutput({result: ''}));
    }
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

  test('can use generator inside renderer', async () => {
    const generator = renderer.generator;
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generate(doc);

    expect(outputModels[0].result).toEqual('test');
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
