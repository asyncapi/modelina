import { CommonSchema } from "./CommonSchema";

/**
 * JSON Schema Draft 7 model
 * 
 * @extends CommonSchema<Schema>
 */
export class Schema extends CommonSchema<Schema | boolean>{
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
    required?: string[];
    allOf?: (Schema | boolean)[];
    oneOf?: (Schema | boolean)[];
    anyOf?: (Schema | boolean)[];
    not?: (Schema | boolean);
    additionalItems?: boolean | Schema;
    contains?: (Schema | boolean);
    const?: any;
    dependencies?: { [key: string]: Schema | boolean | string[]; };
    propertyNames?: Schema | boolean;
    patternProperties?: { [key: string]: Schema | boolean; };
    if?: Schema | boolean;
    then?: Schema | boolean;
    else?: Schema | boolean;
    format?: string; //Enum?
    contentEncoding?: string; //Enum?
    contentMediaType?: string; //Enum?
    definitions?: { [key: string]: Schema | boolean; };
    description?: string;
    default?: string;
    readOnly?: boolean;
    writeOnly?: boolean;
    examples?: Object[];

    /**
     * Transform object into a type of Schema.
     * 
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    static toSchema(object: Object): Schema | boolean {
        const seenSchemas: Map<any, Schema> = new Map();
        const callback = (object: Object): Schema | boolean => {
            if (typeof object === "boolean") return object;
            if (seenSchemas.has(object)) return seenSchemas.get(object) as Schema;
            let schema = new Schema();
            schema = Object.assign(schema, object as Schema);
            seenSchemas.set(object, schema);
            schema = CommonSchema.transformSchema(schema, callback) as Schema;

            //Transform JSON Schema properties which contain nested schemas into an instance of Schema
            if (schema.allOf !== undefined) {
                schema.allOf = schema.allOf.map((item) => callback(item))
            }
            if (schema.oneOf !== undefined) {
                schema.oneOf = schema.oneOf.map((item) => callback(item))
            }
            if (schema.anyOf !== undefined) {
                schema.anyOf = schema.anyOf.map((item) => callback(item))
            }

            if (schema.not !== undefined) {
                schema.not = callback(schema.not);
            }

            if (typeof schema.additionalItems === 'object' &&
                schema.additionalItems !== null) {
                schema.additionalItems = callback(schema.additionalItems);
            }
            if (schema.contains !== undefined) {
                schema.contains = callback(schema.contains);
            }
            if (schema.dependencies !== undefined) {
                var dependencies: { [key: string]: Schema | boolean | string[] } = {}
                Object.entries(schema.dependencies).forEach(([propertyName, property]) => {
                    //We only care about object dependencies
                    if (typeof property === 'object' && !Array.isArray(property)) {
                        dependencies[propertyName] = callback(property);
                    } else {
                        dependencies[propertyName] = property as string[];
                    }
                });
                schema.dependencies = dependencies;
            }
            if (schema.propertyNames !== undefined) {
                schema.propertyNames = callback(schema.propertyNames);
            }

            if (schema.patternProperties !== undefined) {
                var patternProperties: { [key: string]: Schema | boolean } = {}
                Object.entries(schema.patternProperties).forEach(([propertyName, property]) => {
                    patternProperties[propertyName] = callback(property);
                });
                schema.patternProperties = patternProperties;
            }
            if (schema.if !== undefined) {
                schema.if = callback(schema.if);
            }
            if (schema.then !== undefined) {
                schema.then = callback(schema.then);
            }
            if (schema.else !== undefined) {
                schema.else = callback(schema.else);
            }

            if (schema.definitions !== undefined) {
                var definitions: { [key: string]: Schema | boolean } = {}
                Object.entries(schema.definitions).forEach(([propertyName, property]) => {
                    definitions[propertyName] = callback(property);
                });
                schema.definitions = definitions;
            }
            return schema;
        }
        return callback(object);
    }
}