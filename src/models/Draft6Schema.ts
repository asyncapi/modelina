/**
 * JSON Draft 6 schema model
 */
export class Draft6Schema {
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
  allOf?: (Draft6Schema | boolean)[];
  oneOf?: (Draft6Schema | boolean)[];
  anyOf?: (Draft6Schema | boolean)[];
  not?: Draft6Schema | boolean;
  dependencies?: { [key: string]: Draft6Schema | boolean | string[] };
  format?: string;
  definitions?: { [key: string]: Draft6Schema | boolean };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft6Schema | Draft6Schema[] | boolean;
  properties?: { [key: string]: Draft6Schema | boolean };
  additionalProperties?: Draft6Schema | boolean;
  patternProperties?: { [key: string]: Draft6Schema | boolean };
  $ref?: string;
  required?: string[];
  additionalItems?: Draft6Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: Draft6Schema | boolean;
  const?: any;
  propertyNames?: Draft6Schema | boolean;
  examples?: any[];

  /**
   * Takes a deep copy of the input object and converts it to an instance of Draft6Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): Draft6Schema {
    const convertedSchema = Draft6Schema.internalToSchema(object);
    if (convertedSchema instanceof Draft6Schema) {
      return convertedSchema;
    }
    throw new Error('Could not convert input to expected copy of Draft6Schema');
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, Draft6Schema> = new Map()
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
        copy[Number(i)] = Draft6Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new Draft6Schema();
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
        // Special cases are properties that should be a basic object
        if (
          propName === 'properties' ||
          propName === 'patternProperties' ||
          propName === 'definitions' ||
          propName === 'dependencies'
        ) {
          copyProp = {};
          for (const [propName2, prop2] of Object.entries(prop as any)) {
            copyProp[String(propName2)] = Draft6Schema.internalToSchema(prop2, seenSchemas);
          }
        } else {
          copyProp = Draft6Schema.internalToSchema(prop, seenSchemas);
        }
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
