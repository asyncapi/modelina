/**
 * JSON Draft7Schema Draft 7 model
 */
export class Draft7Schema {
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
  allOf?: (Draft7Schema | boolean)[];
  oneOf?: (Draft7Schema | boolean)[];
  anyOf?: (Draft7Schema | boolean)[];
  not?: Draft7Schema | boolean;
  dependencies?: { [key: string]: Draft7Schema | boolean | string[] };
  format?: string;
  definitions?: { [key: string]: Draft7Schema | boolean };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft7Schema | Draft7Schema[] | boolean;
  properties?: { [key: string]: Draft7Schema | boolean };
  additionalProperties?: Draft7Schema | boolean;
  patternProperties?: { [key: string]: Draft7Schema | boolean };
  $ref?: string;
  required?: string[];
  additionalItems?: Draft7Schema | boolean;

  //Draft 6 modifications
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  //Draft 6 replacements
  $id?: string; //Replaces 'id'
  //Draft 6 additions
  contains?: Draft7Schema | boolean;
  const?: any;
  propertyNames?: Draft7Schema | boolean;
  examples?: any[];

  //Draft 7 additions
  $comment?: string;
  if?: Draft7Schema | boolean;
  then?: Draft7Schema | boolean;
  else?: Draft7Schema | boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  contentEncoding?: string;
  contentMediaType?: string;

  /**
   * Takes a deep copy of the input object and converts it to an instance of Draft7Schema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): Draft7Schema {
    const convertedSchema = Draft7Schema.internalToSchema(object);
    if (convertedSchema instanceof Draft7Schema) {
      return convertedSchema;
    }
    throw new Error('Could not convert input to expected copy of Draft7Schema');
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, Draft7Schema> = new Map()
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
        copy[Number(i)] = Draft7Schema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new Draft7Schema();
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
              copyProp[String(propName2)] = Draft7Schema.internalToSchema(prop2, seenSchemas);
            }
          } else {
            copyProp = Draft7Schema.internalToSchema(prop, seenSchemas);
          }
        } 
        (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
