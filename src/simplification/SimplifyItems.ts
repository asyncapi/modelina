
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import Simplifier from "./Simplifier";

type output = {newModels: CommonModel[] | undefined; items: CommonModel | undefined};
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyItems(schema: Schema | boolean, simplifier : Simplifier) : output {
  let commonItems : CommonModel | undefined;
  let models : CommonModel[] | undefined;
  if(typeof schema !== "boolean"){
    const addToModels = (model : CommonModel[] = []) => { models = [...(models || []), ...model]; }
    const mergeWithItem = (model : CommonModel) => {
      commonItems = CommonModel.mergeCommonModels(commonItems, model, schema);
    }
    const addToItemsAndModels = (out: output) => {
      if(out.newModels !== undefined){
          addToModels(out.newModels);
      }
      if(out.items !== undefined){
        mergeWithItem(out.items);
      }
    };
    const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
      schemas.forEach((itemSchema) => {
        addToItemsAndModels(simplifyItems(itemSchema, simplifier));
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
          addItemsAndModels(simplifier.simplifyRecursive(value));
        })
      }else{
        addItemsAndModels(simplifier.simplifyRecursive(schema.items));
      }
    }

    //If we encounter combination schemas ensure we recursively find the properties
    handleCombinationSchemas(schema.allOf);
    handleCombinationSchemas(schema.oneOf);
    handleCombinationSchemas(schema.anyOf);

    //If we encounter combination schemas ensure we recursively find the properties
    if(schema.then){
      addToItemsAndModels(simplifyItems(schema.then, simplifier));
    }
    if(schema.else){
      addToItemsAndModels(simplifyItems(schema.else, simplifier));
    }
  }
  
  return {newModels: models, items: commonItems}
}