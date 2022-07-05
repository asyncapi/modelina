import { defaultGeneratorOptions, DartGenerator } from '../../../src/generators';
import { DartRenderer } from '../../../src/generators/dart/DartRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockDartRenderer extends DartRenderer {

}
describe('DartRenderer', () => {
  let renderer: DartRenderer;
  beforeEach(() => {
    renderer = new MockDartRenderer(DartGenerator.defaultOptions, new DartGenerator(), [], new CommonModel(), new CommonInputModel());
  });

  describe('nameType()', () => {
    test('should name the type', () => {
      const name = renderer.nameType('type__someType');
      expect(name).toEqual('TypeSomeType');
    });
    test('should render reserved type keyword correctly', () => {
      const name = renderer.nameType('enum');
      expect(name).toEqual('Enum');
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
  describe('renderType()', () => {
    test('Should render refs with pascal case', () => {
      const model = new CommonModel();
      model.$ref = '<anonymous-schema-1>';
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
  });

  describe('toJavaType()', () => {
    test('Should be able to return long', () => {
      expect(renderer.toDartType('long', new CommonModel())).toEqual('int');
      expect(renderer.toDartType('int64', new CommonModel())).toEqual('int');
    });
    test('Should be able to return date', () => {
      expect(renderer.toDartType('date', new CommonModel())).toEqual('DateTime');
    });
    test('Should be able to return time', () => {
      expect(renderer.toDartType('time', new CommonModel())).toEqual('DateTime');
    });
    test('Should be able to return offset date time', () => {
      expect(renderer.toDartType('dateTime', new CommonModel())).toEqual('DateTime');
      expect(renderer.toDartType('date-time', new CommonModel())).toEqual('DateTime');
    });
    test('Should be able to return float', () => {
      expect(renderer.toDartType('float', new CommonModel())).toEqual('double');
    });
    test('Should be able to return byte array', () => {
      expect(renderer.toDartType('binary', new CommonModel())).toEqual('byte[]');
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
      expect(renderer.toDartType('array', model)).toEqual('List<String>');
    });
    test('Should render mismatching tuple types as Object', () => {
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
      expect(renderer.toDartType('array', model)).toEqual('List<Object>');
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
      expect(renderer.toDartType('array', model)).toEqual('List<String>');
    });
    test('Should render Object for tuple and additionalItem type mismatch', () => {
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
      expect(renderer.toDartType('array', model)).toEqual('List<Object>');
    });
  });

  describe('toClassType()', () => {
    test('Should be able to return long object', () => {
      expect(renderer.toClassType('long')).toEqual('int');
    });
    test('Should be able to return float object', () => {
      expect(renderer.toClassType('float')).toEqual('double');
    });
  });

  describe('renderComments()', () => {
    test('Should be able to render comments', () => {
      expect(renderer.renderComments('someComment')).toEqual(`/**
 * someComment
 */`);
    });
  });

  describe('renderAnnotation()', () => {
    test('Should be able to render multiple annotations', () => {
      expect(renderer.renderAnnotation('someComment', {test: 'test2'})).toEqual('@SomeComment(test=test2)');
    });
  });
});
