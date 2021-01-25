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
    static transformSchema<T>(object: CommonSchema<T>, transformationSchemaCallback: (object: Object) => T){
        if(object.items !== undefined){
            if(Array.isArray(object.items)){
                object.items = object.items.map((item) => transformationSchemaCallback(item))
            }else{
                object.items = transformationSchemaCallback(object.items);
            }
        }
        if(object.properties !== undefined){
            Object.entries(object.properties).forEach(([propertyName, property]) => {
                object.properties![propertyName] = transformationSchemaCallback(property);
            });
        }
        if(typeof object.additionalProperties === 'object' && 
            object.additionalProperties !== null){
            object.additionalProperties = transformationSchemaCallback(object.additionalProperties);
        }
        return object;
    }
}