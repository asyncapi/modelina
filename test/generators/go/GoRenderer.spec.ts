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
  describe('nameType()', () => {
    test('Should call naming convention', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
  });
  describe('nameField()', () => {
    test('Should call naming convention', () => {
      const name = renderer.nameField('field__someField');
      expect(name).toEqual('FieldSomeField');
    });
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
