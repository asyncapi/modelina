export class AsyncapiV2ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
  static toExternalDocumentation(object: any): AsyncapiV2ExternalDocumentation {
    let doc = new AsyncapiV2ExternalDocumentation();
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
export class AsyncapiV2Schema {
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
  allOf?: (AsyncapiV2Schema | boolean)[];
  oneOf?: (AsyncapiV2Schema | boolean)[];
  anyOf?: (AsyncapiV2Schema | boolean)[];
  not?: (AsyncapiV2Schema | boolean);
  dependencies?: { [key: string]: AsyncapiV2Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: AsyncapiV2Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: AsyncapiV2Schema | AsyncapiV2Schema[] | boolean;
  properties?: { [key: string]: AsyncapiV2Schema | boolean; };
  additionalProperties?: AsyncapiV2Schema | boolean;
  patternProperties?: { [key: string]: AsyncapiV2Schema | boolean; };
  $ref?: string;
  required?: string[];
  additionalItems?: AsyncapiV2Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: AsyncapiV2Schema | boolean;
  const?: any;
  propertyNames?: AsyncapiV2Schema | boolean;
  examples?: any[];

  //Draft 7 additions
  $comment?: string;
  if?: AsyncapiV2Schema | boolean;
  then?: AsyncapiV2Schema | boolean;
  else?: AsyncapiV2Schema | boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  contentEncoding?: string;
  contentMediaType?: string;

  //AsyncAPI specific keywords
  discriminator?: string;
  externalDocs?: AsyncapiV2ExternalDocumentation;
  deprecated?: boolean;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef

  static toSchema(object: any, seenSchemas: Map<any, AsyncapiV2Schema> = new Map()): AsyncapiV2Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    const schema = new AsyncapiV2Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName !== 'default' &&
        propName !== 'examples' &&
        propName !== 'const' &&
        propName !== 'enums') { 
        if (propName === 'externalDocs') {
          schema.externalDocs = AsyncapiV2ExternalDocumentation.toExternalDocumentation(prop);
        } else if (Array.isArray(prop)) {
          (schema as any)[String(propName)] = [];
          for (const [idx, propEntry] of prop.entries()) {
            if (typeof propEntry === 'object') {
              const convertedSchema = AsyncapiV2Schema.toSchema(propEntry, seenSchemas);
              (schema as any)[String(propName)][Number(idx)] = convertedSchema;
            } else {
              (schema as any)[String(propName)][Number(idx)] = propEntry;
            }
          }
          continue;
        } else if (typeof prop === 'object') {
          const convertedSchema = AsyncapiV2Schema.toSchema(prop, seenSchemas);
          (schema as any)[String(propName)] = convertedSchema;
          continue;
        }
      }
      (schema as any)[String(propName)] = prop;
    }
    return schema;
  }
}
