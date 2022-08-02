import { AnyModel, ArrayModel, BooleanModel, CommonModel, EnumModel, FloatModel, IntegerModel, ObjectModel, StringModel, TupleModel, UnionModel } from '../../src';
import { convertToMetaModel } from '../../src/helpers';
describe('CommonModelToMetaModel', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should default to any model', () => { 
    const cm = new CommonModel();
    cm.$id = 'test';

    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toEqual(true);
  });
  test('should convert to any model', () => { 
    const cm = new CommonModel();
    cm.type = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'];
    cm.$id = 'test';

    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toEqual(true);
  });
  describe('should convert to enum model', () => {
    test('when string enums', () => { 
      const cm = new CommonModel();
      cm.type = 'string';
      cm.$id = 'test';
      cm.enum = [
        'test'
      ];
  
      const model = convertToMetaModel(cm);
  
      expect(model).not.toBeUndefined();
      expect(model instanceof EnumModel).toEqual(true);
      expect((model as EnumModel).values.length).toEqual(1);
      expect((model as EnumModel).values[0].key).toEqual('test');
    });
    test('when different types of values', () => { 
      const cm = new CommonModel();
      cm.type = ['string', 'object', 'number', 'boolean'];
      cm.$id = 'test';
      cm.enum = [
        {test: 1},
        123,
        'test',
        true
      ];
  
      const model = convertToMetaModel(cm);
  
      expect(model).not.toBeUndefined();
      expect(model instanceof EnumModel).toEqual(true);
      expect((model as EnumModel).values.length).toEqual(4);
      expect((model as EnumModel).values[0].value).toEqual({test: 1});
      expect((model as EnumModel).values[1].value).toEqual(123);
      expect((model as EnumModel).values[2].value).toEqual('test');
      expect((model as EnumModel).values[3].value).toEqual(true);
    });
  });
  test('should convert to string model', () => { 
    const cm = new CommonModel();
    cm.type = 'string';
    cm.$id = 'test';

    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof StringModel).toEqual(true);
  });
  test('should convert to float model', () => { 
    const cm = new CommonModel();
    cm.type = 'number';
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof FloatModel).toEqual(true);
  });
  test('should convert to integer model', () => { 
    const cm = new CommonModel();
    cm.type = 'integer';
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof IntegerModel).toEqual(true);
  });
  test('should convert to boolean model', () => { 
    const cm = new CommonModel();
    cm.type = 'boolean';
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof BooleanModel).toEqual(true);
  });
  test('should convert to model', () => { 
    const cm = new CommonModel();
    cm.type = 'object';
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toEqual(true);
  });
  test('should convert to array model', () => { 
    const cm = new CommonModel();
    cm.type = 'array';
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ArrayModel).toEqual(true);
  });
  test('should convert to object model', () => { 
    const spm = new CommonModel();
    spm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'object';
    cm.$id = 'test';
    cm.properties = {
      test: spm
    };
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toEqual(true);
  });
  test('should convert to object model with additional properties', () => { 
    const spm = new CommonModel();
    spm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'object';
    cm.$id = 'test';
    cm.properties = {
      test: spm
    };
    cm.additionalProperties = spm;
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toEqual(true);
    expect((model as ObjectModel).properties['additionalProperties']).not.toBeUndefined();
  });
  test('should convert to object model with additional properties and already existing property with that name', () => { 
    const spm = new CommonModel();
    spm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'object';
    cm.$id = 'test';
    cm.properties = {
      additionalProperties: spm
    };
    cm.additionalProperties = spm;
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toEqual(true);
    expect((model as ObjectModel).properties['additionalProperties']).not.toBeUndefined();
    expect((model as ObjectModel).properties['reserved_additionalProperties']).not.toBeUndefined();
  });
  test('should convert normal array to array model', () => { 
    const spm = new CommonModel();
    spm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'array';
    cm.$id = 'test';
    cm.items = spm;
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ArrayModel).toEqual(true);
  });
  test('should convert array with additional items to array model as union type', () => { 
    const spm = new CommonModel();
    spm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'array';
    cm.$id = 'test';
    cm.items = spm;
    cm.additionalItems = spm;
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ArrayModel).toEqual(true);
    expect((model as ArrayModel).valueModel instanceof UnionModel).toEqual(true); 
  });
  test('should convert array of types to union model', () => { 
    const cm = new CommonModel();
    cm.type = ['string', 'number'];
    cm.$id = 'test';
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof UnionModel).toEqual(true);
    expect((model as UnionModel).union.length).toEqual(2); 
  });
  test('should convert tuple to tuple model', () => { 
    const scm = new CommonModel();
    scm.type = 'string';
    const cm = new CommonModel();
    cm.type = 'array';
    cm.$id = 'test';
    cm.items = [scm, scm];
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof TupleModel).toEqual(true);
    expect((model as TupleModel).tuple.length).toEqual(2); 
  });
  test('should handle recursive models', () => { 
    const cm = new CommonModel();
    cm.type = 'object';
    cm.$id = 'test';
    cm.properties = {
      test: cm
    };
    
    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof ObjectModel).toEqual(true);
  });
});
