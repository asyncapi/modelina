
import { CommonModel } from "../models/CommonModel";
import { Schema } from "../models/Schema";
import {simplifyRecursive} from "./Simplify";
type output = {newModels: CommonModel[] | undefined; properties: { [key: string]: CommonModel } | undefined};
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 */
export default function simplifyProperties(schema: Schema) : output {
  let models : CommonModel[] | undefined;
  const addToModels = (model : CommonModel | CommonModel[]) => {
    if(models === undefined){
      models = [];
    }
    if(Array.isArray(model)){
      models = [...models, ...model];
    }else{
      models.push(model);
    }
  }
  let commonProperties : { [key: string]: CommonModel; } | undefined;
  const addToProperty = (propName: string, propModel : CommonModel) => {
    if(commonProperties === undefined){
      commonProperties = {};
    }

    //TODO if already exist merge the two properties
    if(commonProperties[propName] !== undefined){
      commonProperties[propName] = CommonModel.mergeCommonModels(commonProperties[propName], propModel);
    } else {
      commonProperties[propName] = propModel;
    }
  }
  if(schema.properties !== undefined){
    for(const [prop, propSchema] of Object.entries(schema.properties)){
      let newModels = simplifyRecursive(propSchema);
      addToProperty(prop, newModels[0]);
      //If there are more then one model returned, it is extra.
      if(newModels.length > 1){
        newModels.splice(0,1);
        addToModels(newModels);
      }
    }
  }
  const add = (out: output) => {
    if(out?.newModels !== undefined){
        addToModels(out.newModels);
    }
    if(out.properties !== undefined){
      for(const [prop, propSchema] of Object.entries(out.properties)){
        addToProperty(prop, propSchema);
      }
    }
  };
  //If we encounter combination schemas ensure we recursively find the properties
  if(schema.allOf){
    schema.allOf.forEach((allOfSchema) => {
      add(simplifyProperties(allOfSchema));
    });
  }
  if(schema.oneOf){
    schema.oneOf.forEach((allOfSchema) => {
      add(simplifyProperties(allOfSchema));
    });
  }
  if(schema.anyOf){
    schema.anyOf.forEach((allOfSchema) => {
      add(simplifyProperties(allOfSchema));
    });
  }

  //If we encounter combination schemas ensure we recursively find the properties
  if(schema.then){
    add(simplifyProperties(schema.then));
  }
  if(schema.else){
    add(simplifyProperties(schema.else));
  }
  
  return {newModels: models, properties: commonProperties}
}