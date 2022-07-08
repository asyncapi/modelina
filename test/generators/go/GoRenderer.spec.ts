import { GoGenerator } from '../../../src/generators/go/GoGenerator';
import { GoRenderer } from '../../../src/generators/go/GoRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockGoRenderer extends GoRenderer {

}
describe('GoRenderer', () => {
  let renderer: MockGoRenderer;
  beforeEach(() => {
    renderer = new MockGoRenderer(GoGenerator.defaultOptions, new GoGenerator(), [], new CommonModel(), new CommonInputModel());
  });
  describe('renderType()', () => {
    test('Should render refs using type naming convention', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('*AnonymousSchema1');
    });
    test('Should render union types with one type as slice of that type', () => {
      const model = CommonModel.toCommonModel({ type: ['number'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('[]float64');
    });
    test('Should render union types with multiple types as slice of interface', () => {
      const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('[]interface{}');
    });
  });
});
