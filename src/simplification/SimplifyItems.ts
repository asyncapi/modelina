
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import {simplifyRecursive} from "./Simplify";

/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyItems(schema: Schema) : CommonModel[] | undefined {
  let commonItems : CommonModel[] | undefined;
  const addToItems = (model : CommonModel[] | undefined) => {
    if(model === undefined) return;
    if(commonItems === undefined){
      commonItems = [];
    }
    commonItems = [...commonItems, ...model]; 
  }

  const handleCombinationSchemas = (schemas: Schema[] = []) => {
    schemas.forEach((schema) => {
      addToItems(simplifyItems(schema));
    });
  }

  if(schema.items !== undefined){
    commonItems = [];
    if(Array.isArray(schema.items)){
      schema.items.forEach((value) => {
        var models = simplifyRecursive(value);
        if(commonItems!.length == 1 ){

        }else{
          if(models.length > 1){
          } else {
            commonItems[0] = models[0];
          }
        }
        CommonModel.mergeCommonModels(commonItems[0], );
      })
    }else{
      var models = simplifyRecursive(schema);
      addToItems(simplifyItems(schema));
    }
  }

  //If we encounter combination schemas ensure we recursively find the properties
  handleCombinationSchemas(schema.allOf);
  handleCombinationSchemas(schema.oneOf);
  handleCombinationSchemas(schema.anyOf);

  //If we encounter combination schemas ensure we recursively find the properties
  if(schema.then){
    addToItems(simplifyItems(schema.then));
  }
  if(schema.else){
    addToItems(simplifyItems(schema.else));
  }
  
  return commonItems;
}