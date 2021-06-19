/**
 * CommonSchema which contains the common properties between Schema and CommonModel
 */
export class CommonSchema<T> {
    $id?: string;
    type?: string | string[];
    enum?: any[];
    items?: T | T[];
    properties?: { [key: string]: T; };
    additionalProperties?: T;
    patternProperties?: { [key: string]: T; };
    $ref?: string;
    required?: string[];
    additionalItems?: T;
    
    /**
     * Function to transform nested schemas into type of generic extended class
     * 
     * Since both CommonModel and Schema uses these properties we need a common function to
     * convert nested schemas into their corresponding class.
     * 
     * @param schema to be transformed
     * @param transformationSchemaCallback callback to transform nested schemas
     */
    static transformSchema<T extends CommonSchema<T | boolean>>(schema: T, transformationSchemaCallback: (object: T | boolean, seenSchemas: Map<any, T>) => T | boolean, seenSchemas: Map<any, T> = new Map()) : T {
      if (schema.items !== undefined) {
        if (Array.isArray(schema.items)) {
          schema.items = schema.items.map((item) => transformationSchemaCallback(item, seenSchemas));
        } else {
          schema.items = transformationSchemaCallback(schema.items, seenSchemas);
        }
      }
      if (schema.properties !== undefined) {
        const properties : {[key: string]: T | boolean} = {};
        for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
          properties[String(propertyName)] = transformationSchemaCallback(propertySchema, seenSchemas);
        }
        schema.properties = properties;
      }
      if (typeof schema.additionalProperties === 'object' && 
            schema.additionalProperties !== undefined) {
        schema.additionalProperties = transformationSchemaCallback(schema.additionalProperties, seenSchemas);
      }
      if (typeof schema.additionalItems === 'object' && 
            schema.additionalItems !== undefined) {
        schema.additionalItems = transformationSchemaCallback(schema.additionalItems, seenSchemas);
      }
      if (typeof schema.patternProperties === 'object' && 
            schema.patternProperties !== undefined) {
        const patternProperties : {[key: string]: T | boolean} = {};
        for (const [pattern, patternSchema] of Object.entries(schema.patternProperties)) {
          patternProperties[String(pattern)] = transformationSchemaCallback(patternSchema, seenSchemas);
        }
        schema.patternProperties = patternProperties;
      }
      return schema;
    }
}
