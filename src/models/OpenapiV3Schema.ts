export class OpenapiV3Xml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
  static toXml(object: any): OpenapiV3Xml {
    const doc = new OpenapiV3Xml();
    for (const [propName, prop] of Object.entries(object)) {
      (doc as any)[String(propName)] = prop;
    }
    return doc;
  }
}

export class OpenAPIV3ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
  static toExternalDocumentation(object: any): OpenAPIV3ExternalDocumentation {
    const doc = new OpenAPIV3ExternalDocumentation();
    for (const [propName, prop] of Object.entries(object)) {
      (doc as any)[String(propName)] = prop;
    }
    return doc;
  }
}
export class OpenapiV3Discriminator {
  propertyName?: string;
  mapping?: { [k: string]: string };
  static toDiscriminator(object: any): OpenapiV3Discriminator {
    const doc = new OpenapiV3Discriminator();
    for (const [propName, prop] of Object.entries(object)) {
      (doc as any)[String(propName)] = prop;
    }
    return doc;
  }
}

/**
 * OpenAPI 3.0 -> 3.0.4 schema model
 *
 * Based on Draft 6, but with restricted keywords and definitions
 * Modifications
 *  - type, cannot be an array nor contain 'null'
 *
 * Restrictions (keywords not allowed)
 *  - patternProperties
 *  - not
 *
 * https://swagger.io/specification/#schema-object
 */
export class OpenapiV3Schema {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  //Must be according to https://www.ecma-international.org/ecma-262/5.1/#sec-15.10.1
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: (OpenapiV3Schema | boolean)[];
  oneOf?: (OpenapiV3Schema | boolean)[];
  anyOf?: (OpenapiV3Schema | boolean)[];
  dependencies?: { [key: string]: OpenapiV3Schema | boolean | string[] };
  format?: string;
  definitions?: { [key: string]: OpenapiV3Schema | boolean };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: OpenapiV3Schema | OpenapiV3Schema[] | boolean;
  properties?: { [key: string]: OpenapiV3Schema | boolean };
  additionalProperties?: OpenapiV3Schema | boolean;
  $ref?: string;
  required?: string[];
  additionalItems?: OpenapiV3Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: boolean | number;
  exclusiveMinimum?: boolean | number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: OpenapiV3Schema | boolean;
  const?: any;
  propertyNames?: OpenapiV3Schema | boolean;
  examples?: any;

  //OpenAPI 3.0 -> 3.0.4 additions
  nullable?: boolean;
  discriminator?: OpenapiV3Discriminator;
  xml?: OpenapiV3Xml;
  readOnly?: boolean;
  writeOnly?: boolean;
  externalDocs?: OpenAPIV3ExternalDocumentation;
  example?: any;
  deprecated?: boolean;

  //OpenAPI 3.0 -> 3.1.0 additions
  contentEncoding?: string;
  contentMediaType?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef

  /**
   * Takes a deep copy of the input object and converts it to an instance of OpenapiV3Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): OpenapiV3Schema {
    const convertedSchema = OpenapiV3Schema.internalToSchema(object);
    if (convertedSchema instanceof OpenapiV3Schema) {
      return convertedSchema;
    }
    throw new Error(
      'Could not convert input to expected copy of OpenapiV3Schema'
    );
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, OpenapiV3Schema> = new Map()
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
        copy[Number(i)] = OpenapiV3Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new OpenapiV3Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      let copyProp = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (propName !== 'default' && propName !== 'enum') {
        // Custom convert to External documentation instance
        if (propName === 'externalDocs') {
          schema.externalDocs =
            OpenAPIV3ExternalDocumentation.toExternalDocumentation(prop);
          continue;
        } else if (propName === 'xml') {
          schema.xml = OpenapiV3Xml.toXml(prop);
          continue;
        } else if (propName === 'discriminator') {
          schema.discriminator = OpenapiV3Discriminator.toDiscriminator(prop);
          continue;
        }
        copyProp = OpenapiV3Schema.internalToSchema(prop, seenSchemas);
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
