import { split, SplitOptions } from '../../src/helpers';
import { ObjectModel, ReferenceModel, StringModel, ObjectPropertyModel } from '../../src/models';
describe('Splitter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should split models when asked for it', () => { 
    const stringModel = new StringModel('testString', undefined);
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel('testObj', undefined, {
      test: propertyModel
    });
    const options: SplitOptions = {
      splitString: true
    };
    const splittedModels = split(model, options);
    
    const expectedObjectModel = model;
    expectedObjectModel.properties['test'].property = new ReferenceModel(stringModel.name, stringModel.originalInput, stringModel);
    
    expect(splittedModels.length).toEqual(2);
    expect(splittedModels[0] instanceof ObjectModel).toEqual(true);
    expect(splittedModels[0]).toEqual(expectedObjectModel);
    expect(splittedModels[1] instanceof StringModel).toEqual(true);
  });
  test('should not split models when not asked for', () => { 
    const stringModel = new StringModel('testString', undefined);
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel('testObj', undefined, {
      test: propertyModel
    });
    const options: SplitOptions = {
      splitString: false
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(1);
    
    expect(splittedModels[0]).toEqual(model);
  });
  test('should not split models when asked for something else', () => { 
    const stringModel = new StringModel('testString', undefined);
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel('testObj', undefined, {
      test: propertyModel
    });
    const options: SplitOptions = {
      splitBoolean: true
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(1);
    expect(splittedModels[0]).toEqual(model);
  });
});
