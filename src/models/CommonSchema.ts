import { ParsedSchema } from "./ParsedSchema";

/**
 * CommonSchema which contains the common properties between Schema and CommonModel
 */
export class CommonSchema<T> {
    $id?: string;
    type?: string | string[]; //Enum?
    enum?: any[];
    items?: T | T[];
    properties?: { [key: string]: T; };
    additionalProperties?: boolean | T;
    $ref?: string;

    /**
     * Function to transform nested schemas into type of generic extended class
     * 
     * Since both CommonModel and Schema uses these properties we need a common function to
     * convert nested schemas into their corresponding class.
     * 
     * @param schema to be transformed
     * @param transformationSchemaCallback callback to transform nested schemas
     */
    static transformSchema<T>(schema: CommonSchema<T>, transformationSchemaCallback: (object: Object) => T) : CommonSchema<T>{
        if(schema.items !== undefined){
            if(Array.isArray(schema.items)){
                schema.items = schema.items.map((item) => transformationSchemaCallback(item))
            }else{
                schema.items = transformationSchemaCallback(schema.items);
            }
        }
        if(schema.properties !== undefined){
            var properties : {[key: string]: T} = {}
            Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
                if(schema instanceof ParsedSchema && schema.circularProps !== undefined && schema.circularProps.includes(propertyName)) return;
                properties[propertyName] = transformationSchemaCallback(propertySchema);
            });
            schema.properties = properties;
        }
        if(typeof schema.additionalProperties === 'object' && 
            schema.additionalProperties !== null){
            schema.additionalProperties = transformationSchemaCallback(schema.additionalProperties);
        }
        return schema as T;
    }
}