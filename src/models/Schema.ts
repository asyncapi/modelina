import { CommonSchema } from './CommonSchema';

/**
 * JSON Schema Draft 7 model
 * 
 * @extends CommonSchema<Schema>
 */
export class Schema extends CommonSchema<Schema | boolean> {
  $schema?: string;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  allOf?: (Schema | boolean)[];
  oneOf?: (Schema | boolean)[];
  anyOf?: (Schema | boolean)[];
  not?: (Schema | boolean);
  contains?: (Schema | boolean);
  const?: any;
  dependencies?: { [key: string]: Schema | boolean | string[]; };
  propertyNames?: Schema | boolean;
  if?: Schema | boolean;
  then?: Schema | boolean;
  else?: Schema | boolean;
  format?: string; //Enum?
  contentEncoding?: string; //Enum?
  contentMediaType?: string; //Enum?
  definitions?: { [key: string]: Schema | boolean; };
  description?: string;
  default?: any;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: any[];
  [k: string]: any; // eslint-disable-line no-undef

  static toSchema(object: any, seenSchemas: Map<any, Schema> = new Map()): Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    let schema = new Schema();
    schema = Object.assign(schema, object);
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName === 'default' ||
        propName === 'examples' ||
        propName === 'const' ||
        propName === 'enums') { continue; }
      if (Array.isArray(prop)) {
        for (const [idx, propEntry] of prop.entries()) {
          if (typeof propEntry === 'object') {
            const convertedSchema = Schema.toSchema(propEntry, seenSchemas);
            (schema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (schema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      } else if (typeof prop === 'object') {
        const convertedSchema = Schema.toSchema(prop, seenSchemas);
        (schema as any)[String(propName)] = convertedSchema;
      }
    }
    return schema;
  }
}
