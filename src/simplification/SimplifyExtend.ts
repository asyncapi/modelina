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
  if(typeof schema !== "boolean" && schema.allOf !== undefined){
    schema.allOf.forEach((allOfSchema) => {
      if(typeof allOfSchema !== "boolean"){
        let simplifiedModels = simplifier.simplify(allOfSchema);
        if(simplifiedModels.length > 0){
          //If the root schema is of type object and has an id (should always have one) then extend the model
          const rootSimplifiedModel = simplifiedModels[simplifiedModels.length-1];
          if(rootSimplifiedModel.type !== undefined && rootSimplifiedModel.type.includes("object") && rootSimplifiedModel.$id !== undefined){
            extendingSchemas = [...(extendingSchemas || []), rootSimplifiedModel.$id];
            models = [...(models || []), ...simplifiedModels];
          }
        }
      }
    });
  }
  return {newModels: models, extendingSchemas};
}