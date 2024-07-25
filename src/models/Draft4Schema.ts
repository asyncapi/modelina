/**
 * JSON Draft 4 schema model
 */
export class Draft4Schema {
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
  allOf?: Draft4Schema[];
  oneOf?: Draft4Schema[];
  anyOf?: Draft4Schema[];
  not?: Draft4Schema;
  dependencies?: { [key: string]: Draft4Schema | string[] };
  format?: string;
  definitions?: { [key: string]: Draft4Schema };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft4Schema | Draft4Schema[];
  properties?: { [key: string]: Draft4Schema };
  additionalProperties?: Draft4Schema | boolean;
  patternProperties?: { [key: string]: Draft4Schema };
  $ref?: string;
  required?: string[];
  additionalItems?: Draft4Schema | boolean;

  //Draft 4 additions
  id?: string;

  /**
   * Takes a deep copy of the input object and converts it to an instance of Draft4Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): Draft4Schema {
    const convertedSchema = Draft4Schema.internalToSchema(object);
    if (convertedSchema instanceof Draft4Schema) {
      return convertedSchema;
    }
    throw new Error('Could not convert input to expected copy of Draft4Schema');
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, Draft4Schema> = new Map()
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
        copy[Number(i)] = Draft4Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new Draft4Schema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if(prop === undefined) continue;
      let copyProp: any = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (propName !== 'default' && propName !== 'enum') {
        // Special cases are properties that should be a basic object
        if (
          propName === 'properties' ||
          propName === 'patternProperties' ||
          propName === 'definitions' ||
          propName === 'dependencies'
        ) {
          copyProp = {};
          for (const [propName2, prop2] of Object.entries(prop as any)) {
            copyProp[String(propName2)] = Draft4Schema.internalToSchema(prop2, seenSchemas);
          }
        } else {
          copyProp = Draft4Schema.internalToSchema(prop, seenSchemas);
        }
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
