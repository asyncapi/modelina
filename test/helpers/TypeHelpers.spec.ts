import { TypeHelpers, ModelKind } from '../../src/helpers'; 
import { CommonModel } from '../../src/models';

describe('TypeHelpers', () => {
  describe('extractKind', () => {
    test('should return object', () => {
      const model = new CommonModel();
      model.type = 'object';
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.OBJECT);
    });

    test('should return array', () => {
      const model = new CommonModel();
      model.type = 'array';
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.ARRAY);
    });

    test('should return enum', () => {
      const model = new CommonModel();
      model.type = 'string';
      model.enum = ['someValue1', 'someValue2'];
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.ENUM);
    });

    test('should return union', () => {
      const model = new CommonModel();
      model.type = ['number', 'string'];
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.UNION);
    });

    test('should return primitive', () => {
      const model = new CommonModel();
      model.type = 'string';
      let kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'number';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'integer';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'boolean';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);
    });
  });
});
