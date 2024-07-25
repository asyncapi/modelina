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
  definitions?: { [key: string]: SwaggerV2Schema };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: SwaggerV2Schema | SwaggerV2Schema[];
  properties?: { [key: string]: SwaggerV2Schema };
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

  /**
   * Takes a deep copy of the input object and converts it to an instance of SwaggerV2Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): SwaggerV2Schema {
    const convertedSchema = SwaggerV2Schema.internalToSchema(object);
    if (convertedSchema instanceof SwaggerV2Schema) {
      return convertedSchema;
    }
    throw new Error(
      'Could not convert input to expected copy of SwaggerV2Schema'
    );
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, SwaggerV2Schema> = new Map()
  ): any {
    // if primitive types return as is
    if (null === object || 'object' !== typeof object) {
      return object;
    }

    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }

    if (object instanceof Array) {
      const copy: any = [];
      for (let i = 0, len = object.length; i < len; i++) {
        copy[Number(i)] = SwaggerV2Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new SwaggerV2Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if(prop === undefined) continue;
      let copyProp: any = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (propName !== 'default' && propName !== 'enum') {
        // Custom convert to External documentation instance
        if (propName === 'externalDocs') {
          schema.externalDocs =
            SwaggerV2ExternalDocumentation.toExternalDocumentation(prop);
          continue;
        } else if (propName === 'xml') {
          schema.xml = SwaggerV2Xml.toXml(prop);
          continue;
        } else if (
          propName === 'properties' ||
          propName === 'patternProperties' ||
          propName === 'definitions' ||
          propName === 'dependencies'
        ) {
          // Special cases are properties that should be a basic object
          copyProp = {};
          for (const [propName2, prop2] of Object.entries(prop as any)) {
            copyProp[String(propName2)] = SwaggerV2Schema.internalToSchema(prop2, seenSchemas);
          }
        } else {
          copyProp = SwaggerV2Schema.internalToSchema(prop, seenSchemas);
        }
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
