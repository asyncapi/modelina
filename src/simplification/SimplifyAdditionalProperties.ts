import { CommonModel } from "models";
import { Schema } from "models/Schema";
import { Simplifier } from "./Simplifier";
type Output = {newModels: CommonModel[] | undefined; additionalProperties: boolean | CommonModel | undefined};

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, simplifier : Simplifier, commonModel: CommonModel) : Output {
  let models : CommonModel[] | undefined;
  const containsAllTypes = (model : CommonModel) => {
    if(model.type !== undefined){
      if(Array.isArray(model.type)){
        return model.type.length === 6;
      }
    }
    return false;
  };
  const addToModels = (model: CommonModel[] = []) => { models = [...(models || []), ...model]; }
  let additionalProperties: boolean | CommonModel | undefined;
  if(typeof schema !== "boolean" && !containsAllTypes(commonModel)){
    if(typeof schema.additionalProperties === "boolean"){
      additionalProperties = schema.additionalProperties;
    } else { 
      if(schema.additionalProperties !== undefined){
        let newModels = simplifier.simplifyRecursive(schema.additionalProperties);
        additionalProperties = newModels[0];
        //If there are more then one model returned, it is extra.
        if (newModels.length > 1) {
          newModels.splice(0, 1);
          addToModels(newModels);
        }
      }else if(commonModel.type?.includes("object")) {
        additionalProperties = true;
      }
    }
  }
  return {newModels: models, additionalProperties};
}