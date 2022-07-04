import { AnyModel, ArrayModel, BooleanModel, CommonModel, FloatModel, IntegerModel, ObjectModel, StringModel, TupleModel, UnionModel } from '../../src';
import { convertToMetaModel } from '../../src/helpers';
describe('CommonModelToMetaModel', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should convert to any model', () => { 
    const cm = new CommonModel();
    cm.type = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'];
    cm.$id = 'test';

    const model = convertToMetaModel(cm);

    expect(model).not.toBeUndefined();
    expect(model instanceof AnyModel).toEqual(true);
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
});
