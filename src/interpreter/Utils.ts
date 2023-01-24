import { CommonModel } from '../models/CommonModel';

/**
 * Check if CommonModel is an enum
 *
 * @param model
 */
export function isEnum(model: CommonModel): boolean {
  if (model.enum !== undefined) {
    return true;
  }
  return false;
}

/**
 * Check if CommonModel is a separate model or a simple model.
 * @param model
 */
export function isModelObject(model: CommonModel): boolean {
  if (model.type !== undefined) {
    // If all possible JSON types are defined, don't split it even if it does contain object.
    if (Array.isArray(model.type) && model.type.length === 7) {
      return false;
    }
    return model.type.includes('object');
  }
  return false;
}

/**
 * Infers the JSON Schema type from value
 *
 * @param value to infer type of
 */
export function inferTypeFromValue(value: any): string {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  const typeOfEnum = typeof value;
  if (typeOfEnum === 'bigint') {
    return 'integer';
  }
  return typeOfEnum;
}

/**
 * Find the name for simplified version of schema
 *
 * @param schema to find the name
 */
export function interpretName(schema: any | boolean): string | undefined {
  if (schema && typeof schema === 'object') {
    return schema.title || schema.$id || schema['x-modelgen-inferred-name'];
  }
}
