import { split, SplitOptions } from '../../src/helpers';
import {
  ObjectModel,
  ReferenceModel,
  StringModel,
  ObjectPropertyModel
} from '../../src/models';
describe('Splitter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should split models when asked for it', () => {
    const stringModel = new StringModel('testString', undefined, {});
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel(
      'testObj',
      undefined,
      {},
      {
        test: propertyModel
      }
    );
    const options: SplitOptions = {
      splitString: true
    };
    const splittedModels = split(model, options);

    const expectedObjectModel = model;
    expectedObjectModel.properties['test'].property = new ReferenceModel(
      stringModel.name,
      stringModel.originalInput,
      {},
      stringModel
    );

    expect(splittedModels.length).toEqual(2);
    expect(splittedModels[0] instanceof ObjectModel).toEqual(true);
    expect(splittedModels[0]).toEqual(expectedObjectModel);
    expect(splittedModels[1] instanceof StringModel).toEqual(true);
  });
  test('should not split models when not asked for', () => {
    const stringModel = new StringModel('testString', undefined, {});
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel(
      'testObj',
      undefined,
      {},
      {
        test: propertyModel
      }
    );
    const options: SplitOptions = {
      splitString: false
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(1);

    expect(splittedModels[0]).toEqual(model);
  });
  test('should not split models when asked for something else', () => {
    const stringModel = new StringModel('testString', undefined, {});
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel(
      'testObj',
      undefined,
      {},
      {
        test: propertyModel
      }
    );
    const options: SplitOptions = {
      splitBoolean: true
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(1);
    expect(splittedModels[0]).toEqual(model);
  });
  test('should split out nested models', () => {
    const nestedStringModel = new StringModel('nestedString', undefined, {});
    const nestedPropertyModel = new ObjectPropertyModel(
      'nestedStringProp',
      false,
      nestedStringModel
    );
    const nestedObjectModel = new ObjectModel(
      'nestedTestObj',
      undefined,
      {},
      {
        test: nestedPropertyModel
      }
    );
    const objectPropertyModel = new ObjectPropertyModel(
      'stringProp',
      false,
      nestedObjectModel
    );
    const stringModel = new StringModel('string', undefined, {});
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel(
      'testObj',
      undefined,
      {},
      {
        test: propertyModel,
        nested: objectPropertyModel
      }
    );
    const options: SplitOptions = {
      splitString: true,
      splitObject: true
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(4);
    expect(splittedModels[0]).toEqual(model);
    expect(splittedModels[1]).toEqual(stringModel);
    expect(splittedModels[2]).toEqual(nestedObjectModel);
    expect(splittedModels[3]).toEqual(nestedStringModel);
  });
  test('should handle already seen models', () => {
    const stringModel = new StringModel('string', undefined, {});
    const nestedPropertyModel = new ObjectPropertyModel(
      'nestedStringProp',
      false,
      stringModel
    );
    const nestedObjectModel = new ObjectModel(
      'nestedTestObj',
      undefined,
      {},
      {
        test: nestedPropertyModel
      }
    );
    const objectPropertyModel = new ObjectPropertyModel(
      'stringProp',
      false,
      nestedObjectModel
    );
    const propertyModel = new ObjectPropertyModel('test', false, stringModel);
    const model = new ObjectModel(
      'testObj',
      undefined,
      {},
      {
        test: propertyModel,
        nested: objectPropertyModel
      }
    );
    const options: SplitOptions = {
      splitString: true,
      splitObject: true
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(3);
    expect(splittedModels[0]).toEqual(model);
    expect(splittedModels[1]).toEqual(stringModel);
    expect(splittedModels[2]).toEqual(nestedObjectModel);
  });
  test('should handle recursive models', () => {
    const model = new ObjectModel('testObj', undefined, {}, {});
    const objectPropertyModel = new ObjectPropertyModel(
      'recursiveProp',
      false,
      model
    );
    model.properties['recursive'] = objectPropertyModel;

    const options: SplitOptions = {
      splitString: true,
      splitObject: true
    };
    const splittedModels = split(model, options);
    expect(splittedModels.length).toEqual(1);
    expect(splittedModels[0]).toEqual(model);
  });
});
