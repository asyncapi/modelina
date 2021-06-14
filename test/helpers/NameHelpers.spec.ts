import { findPropertyNameForAdditionalProperties } from '../../src/helpers'; 
import { CommonModel } from '../../src/models';

describe('NameHelpers', () => {
  describe('findPropertyNameForAdditionalProperties', () => {
    test('should return correct name for additionalProperties', () => {  
      const model = CommonModel.toCommonModel({});

      const additionalPropertiesName = findPropertyNameForAdditionalProperties(model);
      
      expect(additionalPropertiesName).toEqual('additionalProperties');
    });
    test('should handle duplicate names', () => {  
      const model = CommonModel.toCommonModel({properties: {additionalProperties: {}}});

      const additionalPropertiesName = findPropertyNameForAdditionalProperties(model);
      
      expect(additionalPropertiesName).toEqual('_additionalProperties');
    });
  });
});
