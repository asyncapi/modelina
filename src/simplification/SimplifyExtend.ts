import { CommonModel } from "models";
import { Schema } from "models/Schema";
import Simplifier from "./Simplifier";
type output = {newModels: CommonModel[] | undefined; extendingSchemas: string[] | undefined};

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyExtend(schema: Schema | boolean, simplifier : Simplifier) : output {
  let models : CommonModel[] | undefined;
  let extendingSchemas : string[] | undefined;
  const addToModels = (model : CommonModel[] = []) => { models = [...(models || []), ...model]; }
  const addToExtend = (extending : string) => { extendingSchemas = [...(extendingSchemas || []), extending]; }
  if(typeof schema !== "boolean" && schema.allOf !== undefined){
    schema.allOf.forEach((allOfSchema) => {
      if(typeof allOfSchema !== "boolean"){
        let simplifiedModels = simplifier.simplify(allOfSchema);
        if(simplifiedModels.length > 0){
          const rootSimplifiedModel = simplifiedModels[simplifiedModels.length-1];
          if(rootSimplifiedModel.type !== undefined && rootSimplifiedModel.type.includes("object") && rootSimplifiedModel.properties !== undefined && rootSimplifiedModel.$id !== undefined){
            addToExtend(rootSimplifiedModel.$id);
            addToModels(simplifiedModels);
          } else {
            //Add to properties
          }
        }
      }
    });
  }
  return {newModels: models, extendingSchemas};
}