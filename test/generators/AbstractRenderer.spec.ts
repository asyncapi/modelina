import { AbstractRenderer } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { CommonInputModel, CommonModel } from '../../src/models';

import { TestGenerator, testOptions } from './AbstractGenerator.spec';

describe('AbstractRenderer', function() {
  class TestRenderer extends AbstractRenderer {
    constructor() {
      super(testOptions, new TestGenerator(), [], new CommonModel(), new CommonInputModel());
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

  test('can use generator inside renderer', async function() {
    const generator = renderer.generator;
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generate(doc);

    expect(outputModels[0].result).toEqual('test');
  });

  describe('indent()', function() {
    test('should render text with indentation', function() {
      const content = renderer.indent('Test');
      expect(content).toEqual('  Test');
    });
    test('should render indentation  with options', function() {
      const content = renderer.indent('Test', 4, IndentationTypes.SPACES);
      expect(content).toEqual('    Test');
    });
  });

  describe('nameType()', function() {
    test('should name the type', function() {
      const name = renderer.nameType('someType');
      expect(name).toEqual('type__someType');
    });
  });

  describe('nameProperty()', function() {
    test('should name the property', function() {
      const name = renderer.nameProperty('someProperty');
      expect(name).toEqual('property__someProperty');
    });
  });
});
