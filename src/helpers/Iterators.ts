import { ParsedSchema } from "../models/ParsedSchema";

/**
 * @readonly
 * The different kind of stages when crawling a schema.  
 * 
 * @typedef SchemaIteratorCallbackType
 * @property {string} NEW_SCHEMA The crawler just started crawling a schema.
 * @property {string} END_SCHEMA The crawler just finished crawling a schema.
 */
export enum SchemaIteratorCallbackType {
  NEW_SCHEMA = "NEW_SCHEMA",
  END_SCHEMA = "END_SCHEMA"
}

/**
 * The different types of schemas you can iterate 
 * 
 * @typedef SchemaTypesToIterate
 * @property {string} objects Crawl all schemas of type object
 * @property {string} arrays Crawl all schemas of type array
 * @property {string} oneOfs Crawl all schemas in oneOf's
 * @property {string} allOfs Crawl all schemas in allOf's
 * @property {string} anyOfs Crawl all schemas in anyOf's
 */
export enum SchemaTypesToIterate {
  objects = 'objects',
  arrays = 'arrays',
  oneOfs = 'oneOfs',
  allOfs = 'allOfs',
  anyOfs = 'anyOfs'
}

export declare type TraverseSchemaCallback = (schema: ParsedSchema, callbackType: SchemaIteratorCallbackType, propName?: string) => boolean;

/**
 * Traverse current schema and all nested schemas.
 * 
 * @private
 * @param {Schema} schemaContent schema.
 * @param {TraverseSchemaCallback} callback 
 * @param {SchemaTypesToIterate[]} schemaTypesToIterate
 */
export function traverseSchema(schema: ParsedSchema | boolean, callback: TraverseSchemaCallback, schemaTypesToIterate?: SchemaTypesToIterate[], prop? : string) {
  if (schemaTypesToIterate === undefined) {
    schemaTypesToIterate = Object.values(SchemaTypesToIterate);
  }
  if (schema === null) return;
  if(typeof schema === "boolean") return;
  if (!schemaTypesToIterate.includes(SchemaTypesToIterate.arrays) && schema.type === 'array') return;
  if (!schemaTypesToIterate.includes(SchemaTypesToIterate.objects) && schema.type === 'object') return;
  if (schema.isCircular) return;
  if (callback(schema, SchemaIteratorCallbackType.NEW_SCHEMA, prop) === false) return;
  
  if (schema.type !== undefined) {
    switch (schema.type) {
    case 'object':
      recursiveSchemaObject(schema, callback, schemaTypesToIterate);
      break;
    case 'array':
      recursiveSchemaArray(schema, callback, schemaTypesToIterate);
      break;
    }
  } else {
    traverseCombinedSchemas(schema, callback, schemaTypesToIterate);
  }
  callback(schema, SchemaIteratorCallbackType.END_SCHEMA, prop);
}
  
/**
 * Traverse combined notions
 * 
 * @private
 * @param {Schema} schemaContent schema.
 * @param {TraverseSchemaCallback} callback 
 * @param {SchemaTypesToIterate[]} schemaTypesToIterate
 */
function traverseCombinedSchemas(schema: ParsedSchema, callback: TraverseSchemaCallback, schemaTypesToIterate: SchemaTypesToIterate[]) {
  //check for allOf, oneOf, anyOf
  const checkCombiningSchemas = (combineArray?: (ParsedSchema | boolean)[]) => {
    (combineArray || []).forEach(combineSchema => {
      traverseSchema(combineSchema, callback, schemaTypesToIterate);
    });
  };
  if (schemaTypesToIterate.includes(SchemaTypesToIterate.allOfs)) {
    checkCombiningSchemas(schema.allOf);
  }
  if (schemaTypesToIterate.includes(SchemaTypesToIterate.anyOfs)) {
    checkCombiningSchemas(schema.anyOf);
  }
  if (schemaTypesToIterate.includes(SchemaTypesToIterate.oneOfs)) {
    checkCombiningSchemas(schema.oneOf);
  }
}
  
/**
 * Recursively go through schema of object type and execute callback.
 * 
 * @private
 * @param {Schema} schema Object type.
 * @param {TraverseSchemaCallback} callback 
 * @param {SchemaTypesToIterate[]} schemaTypesToIterate
 */
function recursiveSchemaObject(schema: ParsedSchema, callback: TraverseSchemaCallback, schemaTypesToIterate: SchemaTypesToIterate[]) {
  if (schema.additionalProperties !== undefined && typeof schema.additionalProperties !== 'boolean') {
    const additionalSchema = schema.additionalProperties;
    traverseSchema(additionalSchema, callback, schemaTypesToIterate);
  }
  if (schema.properties !== undefined) {
    const props = schema.properties;
    for (const [prop, propertySchema] of Object.entries(props)) {
      const circularProps = schema.circularProps;
      if (circularProps !== undefined && circularProps.includes(prop)) continue;
      traverseSchema(propertySchema, callback, schemaTypesToIterate, prop);
    }
  }
}
  
/**
 * Recursively go through schema of array type and execute callback.
 * 
 * @private
 * @param {Schema} schema Array type.
 * @param {TraverseSchemaCallback} callback 
 * @param {SchemaTypesToIterate[]} schemaTypesToIterate
 */
function recursiveSchemaArray(schema: ParsedSchema, callback: TraverseSchemaCallback, schemaTypesToIterate: SchemaTypesToIterate[]) {
  if (schema.additionalItems !== undefined) {
    const additionalArrayItems = schema.additionalItems;
    traverseSchema(additionalArrayItems, callback, schemaTypesToIterate);
  }
  
  if (schema.items !== undefined) {
    if (Array.isArray(schema.items)) {
      schema.items.forEach((arraySchema: ParsedSchema | boolean) => {
        traverseSchema(arraySchema, callback, schemaTypesToIterate);
      });
    } else {
      traverseSchema(schema.items, callback, schemaTypesToIterate);
    }
  }
}