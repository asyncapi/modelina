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
  if (Object.keys(rootModel.properties || {}).includes(additionalPropertyName)) {
    return findPropertyNameForAdditionalProperties(rootModel, `_${additionalPropertyName}`);
  }
  return additionalPropertyName;
}
