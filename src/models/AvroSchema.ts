/**
 * Avro Schema model
 */

// clear unknown to make code more robust

export interface AvroField {
  name?: string;
  doc?: string;
  type?: unknown;
  default?: unknown;
}

export class AvroSchema {
  type?: string | string[] | object;
  name?: string;
  namespace?: string;
  doc?: string;
  aliases?: string[];
  symbols?: string[];
  items?: unknown;
  values?: unknown;
  fields?: AvroField[];
  order?: 'ascending' | 'descending' | 'ignore';
  size?: number;
  example?: string | number;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  default?: unknown;
  exclusiveMinimum?: unknown;
  exclusiveMaximum?: unknown;
  logicalType?: unknown;

  /**
   * Takes a deep copy of the input object and converts it to an instance of AvroSchema.
   *
   * @param object
   */
  static toSchema(object: Record<string, unknown>): AvroSchema {
    const convertedSchema = AvroSchema.internalToSchema(object);
    if (convertedSchema instanceof AvroSchema) {
      return convertedSchema;
    }
    throw new Error('Could not convert input to expected copy of AvroSchema');
  }

  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, AvroSchema> = new Map()
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
        copy[Number(i)] = AvroSchema.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new AvroSchema();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      let copyProp = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (propName !== 'default' && propName !== 'enum') {
        copyProp = AvroSchema.internalToSchema(prop, seenSchemas);
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }
}
