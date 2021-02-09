import { CommonSchema } from "./CommonSchema";
import { Schema } from "./Schema";

/**
 * Custom parsed schema right before entering the simplification stage.
 * This class is used for adding properties not part of JSON Schema but needed for the simplification.
 * 
 * @extends Schema
 */
export class ParsedSchema extends Schema {
    isCircular?: boolean;
    circularProps?: string[];
    

    /**
     * Transform object into a type of ParsedSchema.
     * 
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    static toSchema(object: Object) : ParsedSchema | boolean {
        if(typeof object === "boolean") return object;
        let parsedSchema = new ParsedSchema();
        parsedSchema = Object.assign(parsedSchema, object);
        return Schema.transformToSchema(parsedSchema, ParsedSchema.toSchema);
    }
}