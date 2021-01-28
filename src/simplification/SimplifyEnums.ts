import { Schema } from "models/Schema";

/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyEnums(schema: Schema) : any[] {
  let enums : any[] = [];
  const addToEnums = (enumsToCheck: any[]) => {
    enumsToCheck.forEach((value) => {
      if(!enums.includes(value)){
        enums.push(value);
      }
    });
  };
  
  if(schema.enum){
    addToEnums(schema.enum);
  }
  //If we encounter combination schemas ensure we recursively find the enums
  if(schema.allOf){
    schema.allOf.forEach((allOfSchema) => {
      addToEnums(simplifyEnums(allOfSchema));
    });
  }
  if(schema.oneOf){
    schema.oneOf.forEach((allOfSchema) => {
      addToEnums(simplifyEnums(allOfSchema));
    });
  }
  if(schema.anyOf){
    schema.anyOf.forEach((allOfSchema) => {
      addToEnums(simplifyEnums(allOfSchema));
    });
  }

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
    notEnums.forEach((notEnum) => {
      if(enums.includes(notEnum)){
        enums.splice(enums.indexOf(notEnum), 1);
      }
    });
  }

  return enums;
}