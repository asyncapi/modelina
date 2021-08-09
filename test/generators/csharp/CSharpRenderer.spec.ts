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

  describe('toCSharpType()', () => {
    test('Should render undefined as dynamic type', () => {
      expect(renderer.toCSharpType(undefined, new CommonModel())).toEqual('dynamic');
    });
    test('Should render integer as int type', () => {
      expect(renderer.toCSharpType('integer', new CommonModel())).toEqual('int');
    });
    test('Should render number as float type', () => {
      expect(renderer.toCSharpType('number', new CommonModel())).toEqual('float');
    });
    test('Should render array as slice of the type', () => {
      const model = new CommonModel();
      model.items = CommonModel.toCommonModel({ type: 'number' });
      expect(renderer.toCSharpType('array', model)).toEqual('float[]');
    });
    test('Should render tuple with multiple types as dynamic', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({ type: 'number' }), CommonModel.toCommonModel({ type: 'string' })];
      expect(renderer.toCSharpType('array', model)).toEqual('dynamic[]');
    });
    test('Should render object as dynamic type', () => {
      expect(renderer.toCSharpType('object', new CommonModel())).toEqual('object');
    });
  });
  describe('nameType()', () => {
    test('Should call naming convention', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
  });
  describe('nameProperty()', () => {
    test('Should call naming convention', () => {
      const name = renderer.nameProperty('property__someProperty');
      expect(name).toEqual('propertySomeProperty');
    });
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
      expect(renderedType).toEqual('float');
    });
    test('Should render union types with multiple types as slice of interface', () => {
      const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('dynamic');
    });
  });
});
