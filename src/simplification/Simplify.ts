
import { CommonModel, Schema } from '../models';
import simplifyEnums from './SimplifyEnums';
import simplifyTypes from './SimplifyTypes';
let anonymCounter = 1;

/**
 * Simplifies a schema into instances of CommonModel.
 * 
 * @param schema to simplify
 */
export function simplify(schema : Schema | boolean) : CommonModel[] {
  let models : CommonModel[] = [];
  let model = new CommonModel();
  model.originalSchema = Schema.toSchema(schema);
  model.type = simplifyTypes(schema);
  if(typeof schema !== "boolean"){
    //All schemas of type object MUST have ids, for now lets make it simple
    if(model.type !== undefined && model.type.includes("object")){
      let schemaId = schema.$id ? schema.$id : `anonymSchema${anonymCounter++}`;
      if(typeof schema !== "boolean"){
        schema.$id = schemaId;
      }
      model.$id = schemaId;
    } else if (schema.$id !== undefined){
      model.$id = schema.$id;
    }

    const enums = simplifyEnums(schema);
    if(enums.length > 0){
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