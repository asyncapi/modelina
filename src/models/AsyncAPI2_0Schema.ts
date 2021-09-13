export class AsyncAPI2_0ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
  static toExternalDocumentation(object: any): AsyncAPI2_0ExternalDocumentation {
    let doc = new AsyncAPI2_0ExternalDocumentation();
    doc = Object.assign(doc, object);
    return doc;
  }
}

/**
 * AsyncAPI 2.0 -> 2.1 schema model
 * 
 * Based on Draft 7 with additions
 * 
 * https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject
 */
export class AsyncAPI2_0Schema {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: (AsyncAPI2_0Schema | boolean)[];
  oneOf?: (AsyncAPI2_0Schema | boolean)[];
  anyOf?: (AsyncAPI2_0Schema | boolean)[];
  not?: (AsyncAPI2_0Schema | boolean);
  dependencies?: { [key: string]: AsyncAPI2_0Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: AsyncAPI2_0Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: AsyncAPI2_0Schema | AsyncAPI2_0Schema[] | boolean;
  properties?: { [key: string]: AsyncAPI2_0Schema | boolean; };
  additionalProperties?: AsyncAPI2_0Schema | boolean;
  patternProperties?: { [key: string]: AsyncAPI2_0Schema | boolean; };
  $ref?: string;
  required?: string[];
  additionalItems?: AsyncAPI2_0Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: AsyncAPI2_0Schema | boolean;
  const?: any;
  propertyNames?: AsyncAPI2_0Schema | boolean;
  examples?: any[];

  //Draft 7 additions
  $comment?: string;
  if?: AsyncAPI2_0Schema | boolean;
  then?: AsyncAPI2_0Schema | boolean;
  else?: AsyncAPI2_0Schema | boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  contentEncoding?: string;
  contentMediaType?: string;

  //AsyncAPI specific keywords
  discriminator?: string;
  externalDocs?: AsyncAPI2_0ExternalDocumentation;
  deprecated?: boolean;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef

  static toSchema(object: any, seenSchemas: Map<any, AsyncAPI2_0Schema> = new Map()): AsyncAPI2_0Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    let schema = new AsyncAPI2_0Schema();
    schema = Object.assign(schema, object);
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName === 'default' ||
        propName === 'examples' ||
        propName === 'const' ||
        propName === 'enums') { continue; }
      if (propName === 'externalDocs') {
        schema.externalDocs = AsyncAPI2_0ExternalDocumentation.toExternalDocumentation(prop);
      } else if (Array.isArray(prop)) {
        for (const [idx, propEntry] of prop.entries()) {
          if (typeof propEntry === 'object') {
            const convertedSchema = AsyncAPI2_0Schema.toSchema(propEntry, seenSchemas);
            (schema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (schema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      } else if (typeof prop === 'object') {
        const convertedSchema = AsyncAPI2_0Schema.toSchema(prop, seenSchemas);
        (schema as any)[String(propName)] = convertedSchema;
      }
    }
    return schema;
  }
}
