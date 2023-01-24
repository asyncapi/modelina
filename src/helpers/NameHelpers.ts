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
    return getUniquePropertyName(rootModel, `reserved_${propertyName}`);
  }
  return propertyName;
}

/**
 * The common naming convention context type.
 */
export type CommonTypeNamingConventionCtx = { model: CommonModel, inputModel: CommonInputModel, reservedKeywordCallback?: (name: string) => boolean};
export type CommonPropertyNamingConventionCtx = { model: CommonModel, inputModel: CommonInputModel, property?: CommonModel, reservedKeywordCallback?: (name: string) => boolean};

/**
 * The common naming convention type shared between generators for different languages.
 */
export type CommonNamingConvention = {
  type?: (name: string | undefined, ctx: CommonTypeNamingConventionCtx) => string;
  property?: (name: string | undefined, ctx: CommonPropertyNamingConventionCtx) => string;
};

/**
 * A CommonNamingConvention implementation shared between generators for different languages.
 */
export const CommonNamingConventionImplementation: CommonNamingConvention = {
  type: (name, ctx) => {
    if (!name) {return '';}
    let formattedName = FormatHelpers.toPascalCase(name);
    if (ctx.reservedKeywordCallback !== undefined && ctx.reservedKeywordCallback(formattedName)) { 
      formattedName = FormatHelpers.toPascalCase(`reserved_${formattedName}`);
    }
    return formattedName;
  },
  property: (name, ctx) => {
    if (!name) {return '';}
    let formattedName = FormatHelpers.toCamelCase(name);
    if (ctx.reservedKeywordCallback !== undefined && ctx.reservedKeywordCallback(formattedName)) { 
      // If name is considered reserved, make sure we rename it appropriately
      // and make sure no clashes occur.
      formattedName = FormatHelpers.toCamelCase(`reserved_${formattedName}`);
      if (Object.keys(ctx.model.properties || {}).includes(formattedName)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return CommonNamingConventionImplementation.property!(`reserved_${formattedName}`, ctx);
      }
    }
    return formattedName;
  }
};
