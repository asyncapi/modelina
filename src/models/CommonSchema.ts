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
  static transformSchema<T extends CommonSchema<T | boolean>>(buildSchema: T, schema: T, transformationSchemaCallback: (object: T | boolean, seenSchemas: Map<any, T>) => T | boolean, seenSchemas: Map<any, T> = new Map()) : T {
    for (const [propName, prop] of Object.entries(schema)) {
      if (typeof prop === 'object') {
        const convertedSchema = transformationSchemaCallback(prop, seenSchemas);
        (buildSchema as any)[String(propName)] = convertedSchema;
      }
      if (Array.isArray(prop)) {
        for (const [idx, propEntry] of prop.entries()) {
          if (typeof propEntry === 'object') {
            const convertedSchema = transformationSchemaCallback(propEntry, seenSchemas);
            (buildSchema as any)[String(propName)][Number(idx)] = convertedSchema;
          } else {
            (buildSchema as any)[String(propName)][Number(idx)] = propEntry;
          }
        }
      }
      (buildSchema as any)[String(propName)] = prop;
    }
    return buildSchema;
  }
}
