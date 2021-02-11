
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import { Simplifier } from "./Simplifier";

type Output = {newModels: CommonModel[] | undefined; items: CommonModel | undefined};
/**
 * Find the items for a simplified version of a schema
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyItems(schema: Schema | boolean, simplifier : Simplifier, seenSchemas: Map<any, Output> = new Map()) : Output {
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
          addToItemsAndModels(simplifyItems(itemSchema, simplifier, seenSchemas));
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
        addToItemsAndModels(simplifyItems(schema.then, simplifier, seenSchemas));
      }
      if(schema.else){
        addToItemsAndModels(simplifyItems(schema.else, simplifier, seenSchemas));
      }
    }
    
    return tempOutput
}