import { ObjectModel } from '../models';

/**
 * Recursively find the proper property name.
 * 
 * This function ensures that the property name is unique for the model
 * 
 * @param rootModel 
 * @param propertyName 
 */
export function getUniquePropertyName(rootModel: ObjectModel, proposedPropertyName: string): string {
  if (Object.keys(rootModel.properties || {}).includes(proposedPropertyName)) {
    return getUniquePropertyName(rootModel, `reserved_${proposedPropertyName}`);
  }
  return proposedPropertyName;
}

