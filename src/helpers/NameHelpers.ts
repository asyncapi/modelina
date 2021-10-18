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
export type CommonTypeNamingConventionCtx = { 
  model: CommonModel, 
  inputModel: CommonInputModel, 
  reservedKeywordCallback?: (name: string) => boolean, 
  formatterCallback?: (name: string) => string
};
export type CommonPropertyNamingConventionCtx = { 
  model: CommonModel, 
  inputModel: CommonInputModel, 
  property?: CommonModel, 
  reservedKeywordCallback?: (name: string) => boolean, 
  formatterCallback?: (name: string) => string
};

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
    let formatter = ctx.formatterCallback;
    if (formatter === undefined) {
      formatter = FormatHelpers.toPascalCase;
    }

    let formattedName = formatter(name);

    // If name is considered a reserved keyword, make sure we rename it appropriately
    const isReservedKeyword = ctx.reservedKeywordCallback !== undefined ? ctx.reservedKeywordCallback(formattedName) : false;
    if (isReservedKeyword === true) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.type!(`reserved ${formattedName}`, ctx);
    }

    //Make sure no numbers cannot be rendered as first characters
    const firstChar = formattedName.charAt(0); 
    if (firstChar <= '9' && firstChar >= '0') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.type!(`number ${formattedName}`, ctx);
    }
    
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

    let formatter = ctx.formatterCallback;
    if (formatter === undefined) {
      formatter = FormatHelpers.toCamelCase;
    }

    let formattedName = formatter(name);

    //Make sure no numbers can be rendered as first characters as the property name
    const firstChar = formattedName.charAt(0); 
    if (firstChar <= '9' && firstChar >= '0') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`number ${formattedName}`, ctx);
    }

    //Formatted name cannot be the same as the model name, as this will cause problems for most languages
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formattedTypeName = CommonNamingConventionImplementation.type!(ctx.model.$id, ctx);
    if (formattedTypeName.toLowerCase() === formattedName.toLowerCase()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved ${formattedName}`, ctx);
    }

    // If name is considered a reserved keyword, make sure we rename it appropriately
    const isReservedKeyword = ctx.reservedKeywordCallback !== undefined ? ctx.reservedKeywordCallback(formattedName) : false;
    if (isReservedKeyword === true) { 
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved ${formattedName}`, ctx);
    }

    // Check if name has been formatted, if it is lets make sure that the new name does not have any clashes with existing properties 
    const nameHasChanged = formattedName !== name;
    const formattedNameAlreadyIncludedInProperties = nameHasChanged && Object.keys(ctx.model.properties || {}).includes(formattedName);
    const formattedNameIsAdditionalProperties = nameHasChanged && ctx.model.additionalProperties !== undefined && formattedName === CommonNamingConventionImplementation.property!('additionalProperties', {...ctx, property: ctx.model.additionalProperties});
    const formattedNameIsPatternProperties = nameHasChanged && ctx.model.patternProperties !== undefined && formattedName === CommonNamingConventionImplementation.property!('patternProperties', {...ctx, property: ctx.model.additionalProperties});
    if (formattedNameAlreadyIncludedInProperties || formattedNameIsAdditionalProperties || formattedNameIsPatternProperties) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formattedName = CommonNamingConventionImplementation.property!(`reserved ${formattedName}`, ctx);
    }

    return formattedName;
  }
};

