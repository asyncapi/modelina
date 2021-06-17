import { CommonModel } from 'models';

/**
 * Default property names for different aspects of the common model
 */
export enum DefaultPropertyNames {
  additionalProperties = 'additionalProperties'
}

/**
 * Recursively find the proper property name for additionalProperties
 * 
 * This function ensures that the property name for additionalProperties is unique 
 * 
 * @param rootModel 
 * @param propertyName 
 */
export function getUniquePropertyName(rootModel: CommonModel, propertyName: string): string {
  if (Object.keys(rootModel.properties || {}).includes(propertyName)) {
    return getUniquePropertyName(rootModel, `_${propertyName}`);
  }
  return propertyName;
}
