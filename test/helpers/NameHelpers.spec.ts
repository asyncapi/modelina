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
    const isReservedKeyword = jest.fn().mockReturnValue(false);
    const defaultCtx = {model: CommonModel.toCommonModel({$id: 'TempName'}), inputModel: new CommonInputModel(), reservedKeywordCallback: isReservedKeyword};
    describe('type', () => {
      test('should handle undefined', () => {
        const name = undefined;
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('');
      });
      test('Should default name to pascal case', () => {
        const name = 'some_not Pascal string';
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('SomeNotPascalString');
      });

      test('should make sure special characters are removed', () => {
        const name = '!"#€%&/()=?`^*_:>Name';
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('Name');
      });

      test('should make sure no numbers can be the first character', () => {
        const name = '123property';
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('Number_123property');
      });
      test('should return accurate reserved property name', () => {
        const name = 'ref';
        defaultCtx.reservedKeywordCallback.mockReturnValueOnce(true);
        const formattedName = CommonNamingConventionImplementation.type!(name, defaultCtx);
        expect(formattedName).toEqual('ReservedRef');
      });
    });
    describe('property', () => {
      test('should handle undefined', () => {
        const name = undefined;
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('');
      });
      test('should default name to camel case', () => {
        const name = 'some_not camel case string';
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('someNotCamelCaseString');
      });
      test('should return accurate reserved property name', () => {
        const name = 'ref';
        defaultCtx.reservedKeywordCallback.mockReturnValueOnce(false).mockReturnValueOnce(true);
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('reservedRef');
      });
      test('should make sure no numbers can be the first character', () => {
        const name = '123property';
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('number_123property');
      });
      test('should make sure special characters are removed', () => {
        const name = '!"#€%&/()=?`^*_:>Name';
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('name');
      });
      test('property name should not be the same as the model name', () => {
        const name = 'TempName';
        const formattedName = CommonNamingConventionImplementation.property!(name, defaultCtx);
        expect(formattedName).toEqual('reservedTempName');
      });
    });
  });
});
