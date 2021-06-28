import { FormatHelpers } from '../helpers';
import { CommonInputModel, CommonModel } from '../models';

/**
 * Default property names for different aspects of the common model
 */
export enum DefaultPropertyNames {
  additionalProperties = 'additionalProperties',
  patternProperties = 'PatternProperties'
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

/**
 * The common naming convention type shared between generators for different languages.
 */
export type CommonNamingConvention = {
  type?: (name: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel }) => string;
  property?: (test: string | undefined, ctx: { model: CommonModel, inputModel: CommonInputModel, property?: CommonModel }) => string;
};

/**
 * A CommonNamingConvention implementation shared between generators for different languages.
 */
export const CommonNamingConventionImplementation: CommonNamingConvention = {
  type: (name: string | undefined) => {
    if (!name) {return '';}
    return FormatHelpers.toPascalCase(name);
  },
  property: (test: string | undefined) => {
    if (!test) {return '';}
    return FormatHelpers.toCamelCase(test);
  }
};
