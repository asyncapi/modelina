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
 * AsyncAPI 2.0 + 2.1 schema model
 * 
 * Based on Draft 7 with additions
 * 
 * https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject
 */
export class AsyncAPI2Schema {
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
  allOf?: (AsyncAPI2Schema | boolean)[];
  oneOf?: (AsyncAPI2Schema | boolean)[];
  anyOf?: (AsyncAPI2Schema | boolean)[];
  not?: (AsyncAPI2Schema | boolean);
  dependencies?: { [key: string]: AsyncAPI2Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: AsyncAPI2Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: AsyncAPI2Schema | AsyncAPI2Schema[] | boolean;
  properties?: { [key: string]: AsyncAPI2Schema | boolean; };
  additionalProperties?: AsyncAPI2Schema | boolean;
  patternProperties?: { [key: string]: AsyncAPI2Schema | boolean; };
  $ref?: string;
  required?: string[];
  additionalItems?: AsyncAPI2Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: AsyncAPI2Schema | boolean;
  const?: any;
  propertyNames?: AsyncAPI2Schema | boolean;
  examples?: any[];

  //Draft 7 additions
  $comment?: string;
  if?: AsyncAPI2Schema | boolean;
  then?: AsyncAPI2Schema | boolean;
  else?: AsyncAPI2Schema | boolean;
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

  static toSchema(object: any, seenSchemas: Map<any, AsyncAPI2Schema> = new Map()): AsyncAPI2Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    const schema = new AsyncAPI2Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName !== 'default' &&
        propName !== 'examples' &&
        propName !== 'const' &&
        propName !== 'enums') { 
        if (propName === 'externalDocs') {
          schema.externalDocs = AsyncAPI2_0ExternalDocumentation.toExternalDocumentation(prop);
        } else if (Array.isArray(prop)) {
          (schema as any)[String(propName)] = [];
          for (const [idx, propEntry] of prop.entries()) {
            if (typeof propEntry === 'object') {
              const convertedSchema = AsyncAPI2Schema.toSchema(propEntry, seenSchemas);
              (schema as any)[String(propName)][Number(idx)] = convertedSchema;
            } else {
              (schema as any)[String(propName)][Number(idx)] = propEntry;
            }
          }
          continue;
        } else if (typeof prop === 'object') {
          const convertedSchema = AsyncAPI2Schema.toSchema(prop, seenSchemas);
          (schema as any)[String(propName)] = convertedSchema;
          continue;
        }
      }
      (schema as any)[String(propName)] = prop;
    }
    return schema;
  }
}
