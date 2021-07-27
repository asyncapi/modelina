import { CommonNamingConventionImplementation, DefaultPropertyNames, getUniquePropertyName } from '../../src/helpers'; 
import { CommonInputModel, CommonModel } from '../../src/models';

describe('NameHelpers', () => {
  describe('getUniquePropertyName', () => {
    test('should return correct name for additionalProperties', () => {  
      const model = CommonModel.toCommonModel({});

      const additionalPropertiesName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
      
      expect(additionalPropertiesName).toEqual('additionalProperties');
    });
    test('should handle duplicate names', () => {  
      const model = CommonModel.toCommonModel({properties: {additionalProperties: {}}});

      const additionalPropertiesName = getUniquePropertyName(model, DefaultPropertyNames.additionalProperties);
      
      expect(additionalPropertiesName).toEqual('reserved_additionalProperties');
    });
  });

  describe('CommonNamingConventionImplementation', () => {
    const defaultCtx = {model: CommonModel.toCommonModel({}), inputModel: new CommonInputModel()};
    describe('type', () => {
      test('should handle undefined', () => {
        const name = undefined;
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('');
      });
      test('Should default name to pascal case', () => {
        const name = 'some_not Pascal string';
        const formattedName = CommonNamingConventionImplementation!.type!(name, defaultCtx);
        expect(formattedName).toEqual('SomeNotPascalString');
      });
    });
    describe('property', () => {
      test('should handle undefined', () => {
        const name = undefined;
        const formattedName = CommonNamingConventionImplementation!.property!(name, defaultCtx);
        expect(formattedName).toEqual('');
      });
      test('Should default name to camel case', () => {
        const name = 'some_not Pascal string';
        const formattedName = CommonNamingConventionImplementation!.property!(name, defaultCtx);
        expect(formattedName).toEqual('someNotPascalString');
      });
    });
  });
});
