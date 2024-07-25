export class AsyncapiV2ExternalDocumentation {
  description?: string;
  url?: string;
  //Extensions
  [k: string]: any; // eslint-disable-line no-undef
  static toExternalDocumentation(object: any): AsyncapiV2ExternalDocumentation {
    const doc = new AsyncapiV2ExternalDocumentation();
    for (const [propName, prop] of Object.entries(object)) {
      (doc as any)[String(propName)] = prop;
    }
    return doc;
  }
}

/**
 * AsyncAPI schema model
 *
 * Based on Draft 7 with additions
 *
 * https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.2.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.3.0#schemaObject
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
  not?: AsyncapiV2Schema | boolean;
  dependencies?: { [key: string]: AsyncapiV2Schema | boolean | string[] };
  format?: string;
  definitions?: { [key: string]: AsyncapiV2Schema | boolean };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: AsyncapiV2Schema | AsyncapiV2Schema[] | boolean;
  properties?: { [key: string]: AsyncapiV2Schema | boolean };
  additionalProperties?: AsyncapiV2Schema | boolean;
  patternProperties?: { [key: string]: AsyncapiV2Schema | boolean };
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
 
  /**
   * Takes a deep copy of the input object and converts it to an instance of AsyncapiV2Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): AsyncapiV2Schema {
    const convertedSchema = AsyncapiV2Schema.internalToSchema(object);
    if (convertedSchema instanceof AsyncapiV2Schema) {
      return convertedSchema;
    }
    throw new Error(
      'Could not convert input to expected copy of AsyncapiV2Schema'
    );
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, AsyncapiV2Schema> = new Map()
  ): any {
    // if primitive types return as is
    if (null === object || 'object' !== typeof object) {
      return object;
    }

    if (seenSchemas.has(object)) {
      return seenSchemas.get(object);
    }

    if (object instanceof Array) {
      const copy: any = [];
      for (let i = 0, len = object.length; i < len; i++) {
        copy[Number(i)] = AsyncapiV2Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new AsyncapiV2Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if(prop === undefined) continue;
      let copyProp: any = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (
        propName !== 'default' &&
        propName !== 'examples' &&
        propName !== 'const' &&
        propName !== 'enum'
      ) {
        // Custom convert to External documentation instance
        if (propName === 'externalDocs') {
          schema.externalDocs =
            AsyncapiV2ExternalDocumentation.toExternalDocumentation(prop);
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
            copyProp[String(propName2)] = AsyncapiV2Schema.internalToSchema(prop2, seenSchemas);
          }
        } else {
          copyProp = AsyncapiV2Schema.internalToSchema(prop, seenSchemas);
        }
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
