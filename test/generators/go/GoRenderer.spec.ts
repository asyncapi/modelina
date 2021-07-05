import { GoGenerator } from '../../../src/generators/go/GoGenerator';
import { GoRenderer } from '../../../src/generators/go/GoRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockGoRenderer extends GoRenderer {

}
describe('GoRenderer', () => {
  let renderer: MockGoRenderer;
  beforeEach(() => {
    renderer = new MockGoRenderer({}, new GoGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('toGoType()', () => {
    test('Should render undefined as interface type', () => {
      expect(renderer.toGoType(undefined, new CommonModel())).toEqual('interface{}');
    });
    test('Should render integer as int type', () => {
      expect(renderer.toGoType('integer', new CommonModel())).toEqual('int');
    });
    test('Should render number as float64 type', () => {
      expect(renderer.toGoType('number', new CommonModel())).toEqual('float64');
    });
    test('Should render array as slice of the type', () => {
      const model = new CommonModel();
      model.items = CommonModel.toCommonModel({ type: 'number' });
      expect(renderer.toGoType('array', model)).toEqual('[]float64');
    });
    test('Should render tuple with one type as slice of that type', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({ type: 'number' })];
      expect(renderer.toGoType('array', model)).toEqual('[]float64');
    });
    test('Should render tuple with multiple types as slice of interface{}', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({ type: 'number' }), CommonModel.toCommonModel({ type: 'string' })];
      expect(renderer.toGoType('array', model)).toEqual('[]interface{}');
    });
    test('Should render object as interface type', () => {
      expect(renderer.toGoType('object', new CommonModel())).toEqual('interface{}');
    });
  });
  describe('renderType()', () => {
    test('Should render refs with pascal case (no _ prefix before numbers)', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      expect(renderer.renderType(model)).toEqual('*AnonymousSchema1');
    });
    test('Should render union types with one type as slice of that type', () => {
      const model = CommonModel.toCommonModel({ type: ['number'] });
      expect(renderer.renderType(model)).toEqual('[]float64');
    });
    test('Should render union types with multiple types as slice of interface', () => {
      const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
      expect(renderer.renderType(model)).toEqual('[]interface{}');
    });
  });
});
