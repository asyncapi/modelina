import { CommonModel } from 'models';

/**
 * Recursively find the proper property name for additionalProperties
 * 
 * This function ensures that the property name for additionalProperties is unique 
 * 
 * @param rootModel 
 * @param additionalPropertyName 
 * @returns 
 */
export function findPropertyNameForAdditionalProperties(rootModel: CommonModel, additionalPropertyName = 'additionalProperties'): string {
  if (rootModel.properties !== undefined) {
    for (const propertyName of Object.keys(rootModel.properties)) {
      if (propertyName === additionalPropertyName) {
        return findPropertyNameForAdditionalProperties(rootModel, `_${additionalPropertyName}`);
      }
    }
  }
  return additionalPropertyName;
}
