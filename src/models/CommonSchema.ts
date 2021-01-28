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
     * @param object to be transformed
     * @param transformationSchemaCallback callback to transform nested schemas
     */
    static transformSchema<T>(schema: CommonSchema<T>, object: CommonSchema<T>, transformationSchemaCallback: (object: Object) => T){
        if(object.items !== undefined){
            if(Array.isArray(object.items)){
                schema.items = object.items.map((item) => transformationSchemaCallback(item))
            }else{
                schema.items = transformationSchemaCallback(object.items);
            }
        }
        if(object.properties !== undefined){
            var properties : {[key: string]: T} = {}
            Object.entries(object.properties).forEach(([propertyName, propertySchema]) => {
                properties[propertyName] = transformationSchemaCallback(propertySchema);
            });
            schema.properties = properties;
        }
        if(typeof object.additionalProperties === 'object' && 
            object.additionalProperties !== null){
            schema.additionalProperties = transformationSchemaCallback(object.additionalProperties);
        }
        return schema;
    }
}