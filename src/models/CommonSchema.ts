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

    static transformSchema<T>(object: CommonSchema<T>, transformationSchema: (object: Object) => T){
        if(object.items !== undefined){
            if(Array.isArray(object.items)){
                object.items = object.items.map((item) => transformationSchema(item))
            }else{
                object.items = transformationSchema(object.items);
            }
        }
        if(object.properties !== undefined){
            Object.entries(object.properties).forEach(([propertyName, property]) => {
                object.properties![propertyName] = transformationSchema(property);
            });
        }
        if(typeof object.additionalProperties === 'object' && 
            object.additionalProperties !== null){
            object.additionalProperties = transformationSchema(object.additionalProperties);
        }
        return object;
    }
}