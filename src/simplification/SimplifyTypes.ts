import { Schema } from "models/Schema";


/**
 * Find the types for a simplified version of a schema
 * 
 * @param schema to find the simplified types for
 */
export default function simplifyTypes(schema: Schema | boolean) : string[] {
  //If we find absence of data format ensure all types are returned
  if(typeof schema === "boolean"){
    return ["object", "string", "number", "array", "boolean", "null"];
  }
  let types : string[] = [];
  
  const addToTypes = (typesToCheck: string | string[]) => {
    if(typeof typesToCheck === "string"){
      if(!types.includes(typesToCheck)){
        types.push(typesToCheck);
      }
    }else{
      typesToCheck.forEach(addToTypes);
    }
  };
  const handleCombinationSchemas = (schemas: Schema[] = []) => {
    schemas.forEach((schema) => {
      addToTypes(simplifyTypes(schema));
    });
  }

  if(schema.type){
    addToTypes(schema.type);
  }
  //If we encounter combination schemas ensure we recursively find the types
  handleCombinationSchemas(schema.allOf);
  handleCombinationSchemas(schema.oneOf);
  handleCombinationSchemas(schema.anyOf);

  //If we encounter combination schemas ensure we recursively find and cumulate the types
  if(schema.then){
    addToTypes(simplifyTypes(schema.then));
  }
  if(schema.else){
    addToTypes(simplifyTypes(schema.else));
  }

  //Check enums and const keywords to infer type if type has not already been defined.
  if(!schema.type){
    const inferTypeFromValue = (value: any) => {
      if(Array.isArray(value)){
        return "array";
      }
      if(value === null){
        return "null";
      }
      const typeOfEnum = typeof value;
      switch(typeOfEnum){
        //This should never happen, but just to be sure
        case "undefined": 
        case "function":
        case "symbol":
          return;
        case "bigint": 
          return "number";
        default:
          return typeOfEnum;
      }
    };
    if(schema.enum){
      types = [];
      schema.enum.forEach((value: any) => {
        const inferredType = inferTypeFromValue(value);
        if(inferredType !== undefined){
          addToTypes(inferredType);
        }
      });
    }
    //Should const overwrite the type?
    if(schema.const !== undefined){
      const inferredType = inferTypeFromValue(schema.const);
      if(inferredType !== undefined){
        types = [inferredType];
      }
    }
  }

  //Infer which types should not be there and include what is left, overwrites what ever has been defined earlier.
  if(schema.not){
    let notTypes = simplifyTypes(schema.not);
    let remainingTypes = ["object", "string", "number", "array", "boolean", "null"];
    notTypes.forEach((notType) => {
      if(remainingTypes.includes(notType)){
        remainingTypes.splice(remainingTypes.indexOf(notType), 1);
      }
    });
    //Assign all remaining types
    types = remainingTypes;
  }

  return types;
}