import { Schema } from "models/Schema";

/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyEnums(schema: Schema | boolean) : any[] | undefined {
  if(typeof schema !== "boolean"){
    let enums : any[] = [];
    const addToEnums = (enumsToCheck: any[] | undefined) => {
      if(enumsToCheck === undefined) return;
      enumsToCheck.forEach((value) => {
        if(!enums.includes(value)){
          enums.push(value);
        }
      });
    };
    const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
      schemas.forEach((schema) => {
        addToEnums(simplifyEnums(schema));
      });
    }
    
    if(schema.enum){
      addToEnums(schema.enum);
    }
    //If we encounter combination schemas ensure we recursively find the enums
    handleCombinationSchemas(schema.allOf);
    handleCombinationSchemas(schema.oneOf);
    handleCombinationSchemas(schema.anyOf);

    //If we encounter combination schemas ensure we recursively find the enums
    if(schema.then){
      addToEnums(simplifyEnums(schema.then));
    }
    if(schema.else){
      addToEnums(simplifyEnums(schema.else));
    }

    //If const is defined overwrite any already determined enums
    if(schema.const !== undefined){
      enums = [schema.const]
    }

    //Ensure any enums which should not be present
    if(schema.not){
      let notEnums = simplifyEnums(schema.not);
      if(notEnums !== undefined){
        notEnums.forEach((notEnum) => {
          if(enums.includes(notEnum)){
            enums.splice(enums.indexOf(notEnum), 1);
          }
        });
      }
    }
    return enums;
  }
  return undefined;
}