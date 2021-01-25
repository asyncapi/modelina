import { CommonSchema } from "./CommonSchema";

/**
 * JSON Schema Draft 7 model
 * 
 * @extends CommonSchema<Schema>
 */
export class Schema extends CommonSchema<Schema>{
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
    allOf?: Schema[];
    oneOf?: Schema[];
    anyOf?: Schema[];
    not?: Schema;
    additionalItems?: boolean | Schema;
    contains?: Schema;
    const?: any;
    dependencies?: { [key: string]: Schema | string[]; };
    propertyNames?: Schema;
    patternProperties?: { [key: string]: Schema ; };
    if?: Schema;
    then?: Schema;
    else?: Schema;
    format?: string; //Enum?
    contentEncoding?: string; //Enum?
    contentMediaType?: string; //Enum?
    definitions?: { [key: string]: Schema; };
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
    static toSchema(object: Object) : Schema{
        let schema = new Schema();
        schema = Object.assign(schema, object);
        schema = CommonSchema.transformSchema(schema, Schema.toSchema);

        //Transform JSON Schema properties which contain nested schemas into an instance of Schema
        if(schema.allOf !== undefined){
            schema.allOf = schema.allOf.map((item) => Schema.toSchema(item))
        }
        if(schema.oneOf !== undefined){
            schema.oneOf = schema.oneOf.map((item) => Schema.toSchema(item))
        }
        if(schema.anyOf !== undefined){
            schema.anyOf = schema.anyOf.map((item) => Schema.toSchema(item))
        }

        if(schema.not !== undefined){
            schema.not = Schema.toSchema(schema.not);
        }

        if(typeof schema.additionalItems === 'object' && 
            schema.additionalItems !== null){
            schema.additionalItems = Schema.toSchema(schema.additionalItems);
        }
        if(schema.contains !== undefined){
            schema.contains = Schema.toSchema(schema.contains);
        }
        if(schema.dependencies !== undefined){
            Object.entries(schema.dependencies).forEach(([propertyName, property]) => {
                if(typeof property === 'object' && !Array.isArray(property)){
                    schema.dependencies![propertyName] = Schema.toSchema(property);
                }
            });
        }
        if(schema.propertyNames !== undefined){
            schema.propertyNames = Schema.toSchema(schema.propertyNames);
        }
        if(schema.patternProperties !== undefined){
            Object.entries(schema.patternProperties).forEach(([propertyName, property]) => {
                schema.patternProperties![propertyName] = Schema.toSchema(property);
            });
        }
        if(schema.if !== undefined){
            schema.if = Schema.toSchema(schema.if);
        }
        if(schema.then !== undefined){
            schema.then = Schema.toSchema(schema.then);
        }
        if(schema.else !== undefined){
            schema.else = Schema.toSchema(schema.else);
        }

        if(schema.definitions !== undefined){
            Object.entries(schema.definitions).forEach(([propertyName, property]) => {
                schema.definitions![propertyName] = Schema.toSchema(property);
            });
        }
        return schema;
    }
}