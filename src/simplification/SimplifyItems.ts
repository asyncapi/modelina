
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import { Simplifier } from "./Simplifier";

type Output = {newModels: CommonModel[] | undefined; items: CommonModel | undefined};
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyItems(input: Schema | boolean, simplifier : Simplifier) : Output {
  const seenSchemas: Map<any, Output> = new Map();
  const callback = (schema: Schema | boolean): Output => {
    let tempOutput: Output = {newModels: undefined, items: undefined};
    if(typeof schema !== "boolean"){
      if (seenSchemas.has(schema)) return seenSchemas.get(schema)!;
      seenSchemas.set(schema, tempOutput);
      const addToModels = (model : CommonModel[] = []) => { tempOutput.newModels = [...(tempOutput.newModels || []), ...model]; }
      const mergeWithItem = (model : CommonModel) => {
        tempOutput.items = CommonModel.mergeCommonModels(tempOutput.items, model, schema);
      }
      const addToItemsAndModels = (out: Output) => {
        if(out.newModels !== undefined){
            addToModels(out.newModels);
        }
        if(out.items !== undefined){
          mergeWithItem(out.items);
        }
      };
      const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
        schemas.forEach((itemSchema) => {
          addToItemsAndModels(callback(itemSchema));
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
        addToItemsAndModels(callback(schema.then));
      }
      if(schema.else){
        addToItemsAndModels(callback(schema.else));
      }
    }
    
    return tempOutput
  };
  return callback(input);
}