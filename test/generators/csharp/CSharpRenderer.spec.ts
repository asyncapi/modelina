import { CSharpGenerator } from '../../../src';
import { CSharpRenderer } from '../../../src/generators/csharp/CSharpRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockCSharpRenderer extends CSharpRenderer {

}
describe('CSharpRenderer', () => {
  let renderer: MockCSharpRenderer;
  beforeEach(() => {
    renderer = new MockCSharpRenderer(CSharpGenerator.defaultOptions, new CSharpGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('renderType()', () => {
    test('Should render refs using type naming convention', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('AnonymousSchema_1');
    });
    test('Should render single union type', () => {
      const model = CommonModel.toCommonModel({ type: ['number'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('double?');
    });
    test('Should render union types with multiple types as slice of interface', () => {
      const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('dynamic');
    });
  });
});
