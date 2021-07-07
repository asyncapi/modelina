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
 * Recursively find the proper property name.
 * 
 * This function ensures that the property name is unique for the model
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
 * The common naming convention context type.
 */
export type CommonTypeNamingConventionCtx = { model: CommonModel, inputModel: CommonInputModel};
export type CommonPropertyNamingConventionCtx = { model: CommonModel, inputModel: CommonInputModel, property?: CommonModel};

/**
 * The common naming convention type shared between generators for different languages.
 */
export type CommonNamingConvention = {
  type?: (name: string | undefined , ctx: CommonTypeNamingConventionCtx) => string;
  property?: (name: string | undefined, ctx: CommonPropertyNamingConventionCtx) => string;
};

/**
 * A CommonNamingConvention implementation shared between generators for different languages.
 */
export const CommonNamingConventionImplementation: CommonNamingConvention = {
  type: (name: string | undefined) => {
    if (!name) {return '';}
    return FormatHelpers.toPascalCase(name);
  },
  property: (name: string | undefined) => {
    if (!name) {return '';}
    return FormatHelpers.toCamelCase(name);
  }
};
