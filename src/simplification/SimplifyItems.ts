
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import {simplifyRecursive} from "./Simplify";

type output = {newModels: CommonModel[] | undefined; items: CommonModel | undefined};
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyItems(schema: Schema) : output {
  let commonItems : CommonModel | undefined;
  let models : CommonModel[] | undefined;
  const addToModels = (model : CommonModel[] = []) => { models = [...(models || []), ...model]; }
  const mergeWithItem = (model : CommonModel | undefined) => {
    if(model === undefined) return;
    commonItems = CommonModel.mergeCommonModels(commonItems, model, schema);
  }
  const addToItemsAndModels = (out: output) => {
    if(out?.newModels !== undefined){
        addToModels(out.newModels);
    }
    if(out.items !== undefined){
      mergeWithItem(out.items);
    }
  };
  const handleCombinationSchemas = (schemas: Schema[] = []) => {
    schemas.forEach((itemSchema) => {
      addToItemsAndModels(simplifyItems(itemSchema));
    });
  }

  if(schema.items !== undefined){
    const addItemsAndModels = (newModels : CommonModel[]) => {
      mergeWithItem(newModels[0]);
      //If there are more then one model returned, it is extra.
      if(newModels.length > 1){
        newModels.splice(0,1);
        addToModels(newModels);
      }
    };
    if(Array.isArray(schema.items)){
      schema.items.forEach((value) => {
        addItemsAndModels(simplifyRecursive(value));
      })
    }else{
      addItemsAndModels(simplifyRecursive(schema.items));
    }
  }

  //If we encounter combination schemas ensure we recursively find the properties
  handleCombinationSchemas(schema.allOf);
  handleCombinationSchemas(schema.oneOf);
  handleCombinationSchemas(schema.anyOf);

  //If we encounter combination schemas ensure we recursively find the properties
  if(schema.then){
    addToItemsAndModels(simplifyItems(schema.then));
  }
  if(schema.else){
    addToItemsAndModels(simplifyItems(schema.else));
  }
  
  return {newModels: models, items: commonItems}
}