import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockTypeScriptRenderer extends TypeScriptRenderer {

}
describe('TypeScriptRenderer', function() {
  let renderer: TypeScriptRenderer;
  beforeEach(() => {
    renderer = new MockTypeScriptRenderer({}, [], new CommonModel(), new CommonInputModel());
  });

  describe('renderComments()', function() {
    test('Should be able to render comments', function() {
      expect(renderer.renderComments("someComment")).toEqual(`/**
 * someComment
 */`);
    });
  });

  describe('toTsType()', function() {
    test('Should render any type', function() {
      expect(renderer.toTsType(undefined, new CommonModel())).toEqual(`any`);
    });
    test('Should render number type', function() {
      expect(renderer.toTsType("integer", new CommonModel())).toEqual(`number`);
      expect(renderer.toTsType("number", new CommonModel())).toEqual(`number`);
    });
  });
  describe('renderType()', function() {
    test('Should render refs with pascal case', function() {
      const model = new CommonModel();
      model.$ref = "<anonymous-schema-1>";
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
    test('Should render array of CommonModels', function() {
      const model1 = new CommonModel();
      model1.$ref = "ref1";
      const model2 = new CommonModel();
      model2.$ref = "ref2";
      expect(renderer.renderType([model1, model2])).toEqual('Ref1 | Ref2');
    });
    test('Should render enums', function() {
      const model = new CommonModel();
      model.enum = ["enum1", "enum2", 9];
      expect(renderer.renderType(model)).toEqual('"enum1" | "enum2" | 9');
    });
  });
});
