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

    //Make sure no numbers can be rendered as first characters
    const firstChar = formattedName.charAt(0); 
    if (firstChar <='9' && firstChar >='0') { 
      formattedName = `number_${formattedName}`;
    }

    //Make sure no special chars are present in the property name
    formattedName = formattedName.replace(/[^\w\s*]+/g, 'unknown');
    
    return formattedName;
  },
  /**
   * 
   * 
   * @param name (raw name) of the property
   * @param ctx the context it should be formatted within
   */
  property: (name, ctx) => {
    if (!name) {return '';}
    let formattedName = FormatHelpers.toCamelCase(name);

    //Make sure no numbers can be rendered as first characters as the property name
    const firstChar = formattedName.charAt(0); 
    if (firstChar <= '9' && firstChar >= '0') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`number${formattedName}`, ctx);
    }

    //Make sure no special characters are present in the property name
    formattedName = formattedName.replace(/[^\w\s*]+/g, '');

    //Formatted name cannot be the same as the model name, as this will cause problems for most languages
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formattedTypeName = CommonNamingConventionImplementation.type!(ctx.model.$id, ctx);
    if (formattedTypeName === formattedName) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved_${formattedName}`, ctx);
    }

    // If name is considered a reserved keyword, make sure we rename it appropriately
    if (ctx.reservedKeywordCallback !== undefined && ctx.reservedKeywordCallback(formattedName)) { 
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved_${formattedName}`, ctx);
    }

    // Check if name has been formatted, if it is lets make sure that the new name does not have any clashes with existing properties 
    if (formattedName !== name && Object.keys(ctx.model.properties || {}).includes(formattedName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved_${formattedName}`, ctx);
    }

    return formattedName;
  }
};
