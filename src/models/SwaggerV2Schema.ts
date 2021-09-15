export class SwaggerV2Xml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
  static toXml(object: any): SwaggerV2Xml {
    let doc = new SwaggerV2Xml();
    doc = Object.assign(doc, object);
    return doc;
  }
}

export class SwaggerV2ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
  static toExternalDocumentation(object: any): SwaggerV2ExternalDocumentation {
    let doc = new SwaggerV2ExternalDocumentation();
    doc = Object.assign(doc, object);
    return doc;
  }
}

/**
 * OpenAPI 2.0 (Swagger 2.0) schema model
 * 
 * Based on Draft 4, but with restricted keywords and definitions
 * 
 * Restrictions (keywords not allowed)
 *  - oneOf
 *  - anyOf
 *  - patternProperties
 *  - not
 * 
 * https://swagger.io/specification/v2/#schemaObject
 */
export class SwaggerV2Schema {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: SwaggerV2Schema[];
  format?: string;
  definitions?: { [key: string]: SwaggerV2Schema; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: SwaggerV2Schema | SwaggerV2Schema[];
  properties?: { [key: string]: SwaggerV2Schema; };
  additionalProperties?: SwaggerV2Schema | boolean;
  $ref?: string;
  required?: string[];

  //Draft 4 additions
  id?: string;

  //OpenAPI 2.0 (Swagger 2.0) additions
  discriminator?: string;
  readOnly?: boolean;
  xml?: SwaggerV2Xml;
  externalDocs?: SwaggerV2ExternalDocumentation;
  example?: any;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef

  static toSchema(object: any, seenSchemas: Map<any, SwaggerV2Schema> = new Map()): SwaggerV2Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    let schema = new SwaggerV2Schema();
    schema = Object.assign(schema, object);
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName === 'default' ||
        propName === 'examples' ||
        propName === 'const' ||
        propName === 'enums') { continue; }
      if (propName === 'xml') {
        schema.xml = SwaggerV2Xml.toXml(prop);
      } else if (propName === 'externalDocs') {
        schema.externalDocs = SwaggerV2ExternalDocumentation.toExternalDocumentation(prop);
      } else if (Array.isArray(prop)) {
        for (const [idx, propEntry] of prop.entries()) {
          if (typeof propEntry === 'object') {
            const convertedSchema = SwaggerV2Schema.toSchema(propEntry, seenSchemas);
            (schema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (schema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      } else if (typeof prop === 'object') {
        const convertedSchema = SwaggerV2Schema.toSchema(prop, seenSchemas);
        (schema as any)[String(propName)] = convertedSchema;
      }
    }
    return schema;
  }
}
