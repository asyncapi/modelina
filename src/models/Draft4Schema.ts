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
  dependencies?: { [key: string]: Draft4Schema | string[]; };
  format?: string;
  definitions?: { [key: string]: Draft4Schema; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft4Schema | Draft4Schema[];
  properties?: { [key: string]: Draft4Schema; };
  additionalProperties?: Draft4Schema | boolean;
  patternProperties?: { [key: string]: Draft4Schema; };
  $ref?: string;
  required?: string[];
  additionalItems?: Draft4Schema | boolean;

  //Draft 4 additions
  id?: string;

  static toSchema(object: any, seenSchemas: Map<any, Draft4Schema> = new Map()): Draft4Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    let schema = new Draft4Schema();
    schema = Object.assign(schema, object);
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      if (propName === 'default' ||
        propName === 'enums') { continue; }
      if (Array.isArray(prop)) {
        for (const [idx, propEntry] of prop.entries()) {
          if (typeof propEntry === 'object') {
            const convertedSchema = Draft4Schema.toSchema(propEntry, seenSchemas);
            (schema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (schema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      } else if (typeof prop === 'object') {
        const convertedSchema = Draft4Schema.toSchema(prop, seenSchemas);
        (schema as any)[String(propName)] = convertedSchema;
      }
    }
    return schema;
  }
}
