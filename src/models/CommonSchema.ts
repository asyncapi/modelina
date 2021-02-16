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
    required?: string[];
    
    /**
     * Function to transform nested schemas into type of generic extended class
     * 
     * Since both CommonModel and Schema uses these properties we need a common function to
     * convert nested schemas into their corresponding class.
     * 
     * @param schema to be transformed
     * @param transformationSchemaCallback callback to transform nested schemas
     */
    static transformSchema<T extends CommonSchema<T | boolean>>(schema: T, transformationSchemaCallback: (object: Object, seenSchemas: Map<any, T>) => T | boolean, seenSchemas: Map<any, T> = new Map()) : T {
      if (seenSchemas.has(schema)) return seenSchemas.get(schema) as T;
      if (schema.items !== undefined) {
        if (Array.isArray(schema.items)) {
          schema.items = schema.items.map((item) => transformationSchemaCallback(item, seenSchemas));
        } else {
          schema.items = transformationSchemaCallback(schema.items, seenSchemas);
        }
      }
      if (schema.properties !== undefined) {
        const properties : {[key: string]: T | boolean} = {};
        Object.entries(schema.properties).forEach(([propertyName, propertySchema]) => {
          properties[propertyName] = transformationSchemaCallback(propertySchema, seenSchemas);
        });
        schema.properties = properties;
      }
      if (typeof schema.additionalProperties === 'object' && 
            schema.additionalProperties !== null) {
        schema.additionalProperties = transformationSchemaCallback(schema.additionalProperties, seenSchemas);
      }
      return schema;
    }
}