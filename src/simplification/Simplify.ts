
import { CommonModel, Schema } from '../models';
import simplifyProperties from './SimplifyProperties';
import simplifyEnums from './SimplifyEnums';
import simplifyTypes from './SimplifyTypes';
import simplifyItems from './SimplifyItems';
let anonymCounter = 1;

/**
 * Simplifies a schema by first checking if its an object, if so, split it out and ref it based on id.
 * 
 * @param schema to simplify
 */
export function simplifyRecursive(schema : Schema | boolean) : CommonModel[] {
  let models : CommonModel[] = [];
  let simplifiedModel = simplify(schema);
  if(simplifiedModel.length > 0){
    //Get the root model from the simplification process which is the last element in the list
    //This is because any intermediary models are put in front of the root
    const rootSimplifiedModel = simplifiedModel[simplifiedModel.length-1];
    //Only if the schema is of type object and contains properties, split it out
    if(rootSimplifiedModel.type !== undefined && rootSimplifiedModel.type.includes("object") && rootSimplifiedModel.properties !== undefined){
      let switchRootModel = new CommonModel();
      switchRootModel.$ref = rootSimplifiedModel.$id;
      models[0] = switchRootModel;
    }
  }
  models = [...models, ...simplifiedModel];
  return models;
}


/**
 * Simplifies a schema into instances of CommonModel.
 * 
 * @param schema to simplify
 */
export function simplify(schema : Schema | boolean) : CommonModel[] {
  let models : CommonModel[] = [];
  let model = new CommonModel();
  model.originalSchema = Schema.toSchema(schema);
  const simplifiedTypes = simplifyTypes(schema);
  if(simplifiedTypes !== undefined){
    model.type = simplifiedTypes;
  }
  if(typeof schema !== "boolean"){
    //All schemas of type object MUST have ids, for now lets make it simple
    if(model.type !== undefined && model.type.includes("object")){
      let schemaId = schema.$id ? schema.$id : `anonymSchema${anonymCounter++}`;
      model.$id = schemaId;
    } else if (schema.$id !== undefined){
      model.$id = schema.$id;
    }

    const simplifiedItems = simplifyItems(schema);
    if(simplifiedItems.newModels !== undefined){
        models = [...models, ...simplifiedItems.newModels];
    }
    if(simplifiedItems.items !== undefined){
      model.items = simplifiedItems.items;
    }

    const simplifiedProperties = simplifyProperties(schema);
    if(simplifiedProperties.newModels !== undefined){
        models = [...models, ...simplifiedProperties.newModels];
    }
    if(simplifiedProperties.properties !== undefined){
      model.properties = simplifiedProperties.properties;
    }
    const enums = simplifyEnums(schema);
    if(enums !== undefined && enums.length > 0){
      if(model.enum){
        model.enum = [...model.enum, ...enums];
      }else{
        model.enum = enums;
      }
    }
  }
  models.push(model);
  return models;
}