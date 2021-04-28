import { JavaGenerator, JAVA_DEFAULT_PRESET } from '../../../src/generators'; 
import { JavaRenderer } from '../../../src/generators/java/JavaRenderer';
import { CommonInputModel, CommonModel } from '../../../src/models';
class MockJavaRenderer extends JavaRenderer {

}
describe('JavaRenderer', function() {
  let renderer: JavaRenderer;
  beforeEach(() => {
    renderer = new MockJavaRenderer({}, [], new CommonModel(), new CommonInputModel());
  });

  describe('renderType()', function() {
    test('Should render refs with pascal case', function() {
      const model = new CommonModel();
      model.$ref = "<anonymous-schema-1>";
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
  });

  describe('toJavaType()', function() {
    test('Should render refs with pascal case', function() {
      const model = new CommonModel();
      model.$ref = "<anonymous-schema-1>";
      expect(renderer.renderType(model)).toEqual('AnonymousSchema_1');
    });
    test('Should be able to return long', function() {
      expect(renderer.toJavaType("long", new CommonModel())).toEqual('long');
      expect(renderer.toJavaType("int64", new CommonModel())).toEqual('long');
    });
    test('Should be able to return date', function() {
      expect(renderer.toJavaType("date", new CommonModel())).toEqual('java.time.LocalDate');
    });
    test('Should be able to return time', function() {
      expect(renderer.toJavaType("time", new CommonModel())).toEqual('java.time.OffsetTime');
    });
    test('Should be able to return offset date time', function() {
      expect(renderer.toJavaType("dateTime", new CommonModel())).toEqual('java.time.OffsetDateTime');
      expect(renderer.toJavaType("date-time", new CommonModel())).toEqual('java.time.OffsetDateTime');
    });
    test('Should be able to return float', function() {
      expect(renderer.toJavaType("float", new CommonModel())).toEqual('float');
    });
    test('Should be able to return byte array', function() {
      expect(renderer.toJavaType("binary", new CommonModel())).toEqual('byte[]');
    });
  });

  describe('toClassType()', function() {
    test('Should be able to return long object', function() {
      expect(renderer.toClassType("long")).toEqual('Long');
    });
    test('Should be able to return float object', function() {
      expect(renderer.toClassType("float")).toEqual('Float');
    });
  });

  describe('renderComments()', function() {
    test('Should be able to render comments', function() {
      expect(renderer.renderComments("someComment")).toEqual(`/**
 * someComment
 */`);
    });
  });

  describe('renderAnnotation()', function() {
    test('Should be able to render multiple annotations', function() {
      expect(renderer.renderAnnotation("someComment", {"test": "test2"})).toEqual(`@SomeComment(test=test2)`);
    });
  });
});
