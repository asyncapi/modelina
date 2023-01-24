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
    test('Should render a string type', () => {
      expect(renderer.toCSharpType('string', new CommonModel())).toEqual('string');
      expect(renderer.toCSharpType('password', new CommonModel())).toEqual('string');
      expect(renderer.toCSharpType('byte', new CommonModel())).toEqual('string');
    });
    test('Should render boolean as nullable bool type', () => {
      expect(renderer.toCSharpType('boolean', new CommonModel())).toEqual('bool?');
    });
    test('Should render integer as nullable int type', () => {
      expect(renderer.toCSharpType('integer', new CommonModel())).toEqual('int?');
    });
    test('Should render a nullable double type', () => {
      expect(renderer.toCSharpType('number', new CommonModel())).toEqual('double?');
      expect(renderer.toCSharpType('double', new CommonModel())).toEqual('double?');
    });
    test('Should render array as slice of the type', () => {
      const model = new CommonModel();
      model.items = CommonModel.toCommonModel({ type: 'number' });
      expect(renderer.toCSharpType('array', model)).toEqual('double?[]');
    });
    test('Should render tuple with multiple types as dynamic', () => {
      const model = new CommonModel();
      model.items = [CommonModel.toCommonModel({ type: 'number' }), CommonModel.toCommonModel({ type: 'string' })];
      expect(renderer.toCSharpType('array', model)).toEqual('dynamic[]');
    });
    test('Should render object as object type', () => {
      expect(renderer.toCSharpType('object', new CommonModel())).toEqual('object');
    });
    test('Should be able to return a nullable long', () => {
      expect(renderer.toCSharpType('long', new CommonModel())).toEqual('long?');
      expect(renderer.toCSharpType('int64', new CommonModel())).toEqual('long?');
    });
    test('Should be able to return date time', () => {
      expect(renderer.toCSharpType('time', new CommonModel())).toEqual('System.DateTime?');
      expect(renderer.toCSharpType('date', new CommonModel())).toEqual('System.DateTime?');
      expect(renderer.toCSharpType('dateTime', new CommonModel())).toEqual('System.DateTime?');
      expect(renderer.toCSharpType('date-time', new CommonModel())).toEqual('System.DateTime?');
    });
    test('Should be able to return float', () => {
      expect(renderer.toCSharpType('float', new CommonModel())).toEqual('float?');
    });
    test('Should be able to return byte array', () => {
      expect(renderer.toCSharpType('binary', new CommonModel())).toEqual('byte[]');
    });
    test('Should render matching tuple types as is', () => {
      const model = CommonModel.toCommonModel({
        items: [
          {
            type: 'string'
          },
          {
            type: 'string'
          }
        ]
      });
      expect(renderer.toCSharpType('array', model)).toEqual('string[]');
    });
    test('Should render mismatching tuple types as dynamic', () => {
      const model = CommonModel.toCommonModel({ 
        items: [
          {
            type: 'string'
          },
          {
            type: 'number'
          }
        ]
      });
      expect(renderer.toCSharpType('array', model)).toEqual('dynamic[]');
    });
    test('Should render matching tuple and additionalItem types', () => {
      const model = CommonModel.toCommonModel({
        items: [
          {
            type: 'string'
          }
        ],
        additionalItems: {
          type: 'string'
        }
      });
      expect(renderer.toCSharpType('array', model)).toEqual('string[]');
    });
    test('Should render dynamic for tuple and additionalItem type mismatch', () => {
      const model = CommonModel.toCommonModel({
        items: [
          {
            type: 'string'
          }
        ],
        additionalItems: {
          type: 'number'
        }
      });
      expect(renderer.toCSharpType('array', model)).toEqual('dynamic[]');
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
      expect(renderedType).toEqual('double?');
    });
    test('Should render union types with multiple types as slice of interface', () => {
      const model = CommonModel.toCommonModel({ type: ['number', 'string'] });
      const renderedType = renderer.renderType(model);
      expect(renderedType).toEqual('dynamic');
    });
  });
});
