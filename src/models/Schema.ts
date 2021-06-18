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

    /**
     * Transform object into a type of Schema.
     * 
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static toSchema(object: Schema | boolean, seenSchemas: Map<any, Schema> = new Map()): Schema | boolean {
      if (typeof object === 'boolean') {return object;}
      if (seenSchemas.has(object)) {
        return seenSchemas.get(object) as Schema;
      }

      let schema = new Schema();
      schema = Object.assign(schema, object as Schema);
      seenSchemas.set(object, schema);
      schema = CommonSchema.transformSchema(schema, Schema.toSchema, seenSchemas);

      // Transform JSON Schema properties which contain nested schemas into an instance of Schema
      if (schema.allOf !== undefined) {
        schema.allOf = schema.allOf.map((item) => Schema.toSchema(item, seenSchemas));
      }
      if (schema.oneOf !== undefined) {
        schema.oneOf = schema.oneOf.map((item) => Schema.toSchema(item, seenSchemas));
      }
      if (schema.anyOf !== undefined) {
        schema.anyOf = schema.anyOf.map((item) => Schema.toSchema(item, seenSchemas));
      }

      if (schema.not !== undefined) {
        schema.not = Schema.toSchema(schema.not, seenSchemas);
      }

      if (typeof schema.additionalItems === 'object' &&
            schema.additionalItems !== null) {
        schema.additionalItems = Schema.toSchema(schema.additionalItems, seenSchemas);
      }
      if (schema.contains !== undefined) {
        schema.contains = Schema.toSchema(schema.contains, seenSchemas);
      }
      if (schema.dependencies !== undefined) {
        const dependencies: { [key: string]: Schema | boolean | string[] } = {};
        for (const [propertyName, property] of Object.entries(schema.dependencies)) {
          //We only care about object dependencies
          if (typeof property === 'object' && !Array.isArray(property)) {
            dependencies[String(propertyName)] = Schema.toSchema(property, seenSchemas);
          } else {
            dependencies[String(propertyName)] = property as string[];
          }
        }
        schema.dependencies = dependencies;
      }

      if (schema.propertyNames !== undefined) {
        schema.propertyNames = Schema.toSchema(schema.propertyNames, seenSchemas);
      }
      
      if (schema.if !== undefined) {
        schema.if = Schema.toSchema(schema.if, seenSchemas);
      }
      if (schema.then !== undefined) {
        schema.then = Schema.toSchema(schema.then, seenSchemas);
      }
      if (schema.else !== undefined) {
        schema.else = Schema.toSchema(schema.else, seenSchemas);
      }

      if (schema.definitions !== undefined) {
        const definitions: { [key: string]: Schema | boolean } = {};
        for (const [propertyName, property] of Object.entries(schema.definitions)) {
          definitions[String(propertyName)] = Schema.toSchema(property, seenSchemas);
        }
        schema.definitions = definitions;
      }
      return schema;
    }
}
