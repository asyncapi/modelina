import { defaultGeneratorOptions, TypeScriptGenerator } from '../../../src/generators';
import { TypeScriptRenderer } from '../../../src/generators/typescript/TypeScriptRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockTypeScriptRenderer extends TypeScriptRenderer {

}
describe('TypeScriptRenderer', () => {
  let renderer: TypeScriptRenderer;
  beforeEach(() => {
    renderer = new MockTypeScriptRenderer(TypeScriptGenerator.defaultOptions, new TypeScriptGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('nameType()', () => {
    test('should name the type', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
    test('should render reserved type keyword correctly', () => {
      const name = renderer.nameType('enum');
      expect(name).toEqual('ReservedEnum');
    });
  });
  
  describe('nameProperty()', () => {
    test('should name the property', () => {
      const name = renderer.nameProperty('property__someProperty');
      expect(name).toEqual('propertySomeProperty');
    });
    test('should render reserved property keyword correctly', () => {
      const name = renderer.nameProperty('enum');
      expect(name).toEqual('reservedEnum');
    });
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });

  describe('toTsType()', () => {
    test('Should render unknown type', () => {
      expect(renderer.toTsType(undefined, new CommonModel())).toEqual('any');
    });
    test('Should render number type', () => {
      expect(renderer.toTsType('integer', new CommonModel())).toEqual('number');
      expect(renderer.toTsType('number', new CommonModel())).toEqual('number');
    });
    test('Should render array type', () => {
      const model = new CommonModel();
      model.items = CommonModel.toCommonModel({type: 'number'});
      expect(renderer.toTsType('array', model)).toEqual('Array<number>');
    });
    test('Should render tuple type', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({type: 'number'})];
      expect(renderer.toTsType('array', model)).toEqual('[number]');
    });
    test('Should render tuple type with additionalItems', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({type: 'number'})];
      model.additionalItems = CommonModel.toCommonModel({type: 'string'});
      expect(renderer.toTsType('array', model)).toEqual('[number, ...(string)[]]');
    });
    test('Should render multiple tuples', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({type: 'number'}), CommonModel.toCommonModel({type: 'string'})];
      expect(renderer.toTsType('array', model)).toEqual('[number, string]');
    });
  });
  describe('renderType()', () => {
    test('Should render refs with pascal case', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
    test('Should render array of CommonModels', () => {
      const model1 = new CommonModel();
      model1.$ref = 'ref1';
      const model2 = new CommonModel();
      model2.$ref = 'ref2';
      expect(renderer.renderType([model1, model2])).toEqual('Ref1 | Ref2');
    });
    test('Should render enums', () => {
      const model = new CommonModel();
      model.enum = ['enum1', 'enum2', 9];
      expect(renderer.renderType(model)).toEqual('"enum1" | "enum2" | 9');
    });
  });
});
