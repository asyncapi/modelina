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
  dependencies?: { [key: string]: Draft7Schema | boolean | string[]; };
  format?: string;
  definitions?: { [key: string]: Draft7Schema | boolean; };
  description?: string;
  default?: any;
  type?: string | string[];
  enum?: any[];
  items?: Draft7Schema | Draft7Schema[] | boolean;
  properties?: { [key: string]: Draft7Schema | boolean; };
  additionalProperties?: Draft7Schema | boolean;
  patternProperties?: { [key: string]: Draft7Schema | boolean; };
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

  static toSchema(object: any, seenSchemas: Map<any, Draft7Schema> = new Map()): Draft7Schema | boolean {
    if (typeof object === 'boolean') {return object;}
    if (seenSchemas.has(object)) {
      return seenSchemas.get(object) as any;
    }
    let schema = new Draft7Schema();
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
            const convertedSchema = Draft7Schema.toSchema(propEntry, seenSchemas);
            (schema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (schema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      } else if (typeof prop === 'object') {
        const convertedSchema = Draft7Schema.toSchema(prop, seenSchemas);
        (schema as any)[String(propName)] = convertedSchema;
      }
    }
    return schema;
  }
}
