
import { CommonModel, Schema } from '../models';
import simplifyProperties from './SimplifyProperties';
import simplifyEnums from './SimplifyEnums';
import simplifyTypes from './SimplifyTypes';
import simplifyItems from './SimplifyItems';
import simplifyExtend from './SimplifyExtend';
import { SimplificationOptions } from '../models/SimplificationOptions';
import { ParsedSchema } from 'models/ParsedSchema';
export default class Simplifier {
  static defaultOptions: SimplificationOptions = {
    allowInheritance: true
  }
  options: SimplificationOptions;
  anonymCounter = 1;

  constructor(
    options: SimplificationOptions = Simplifier.defaultOptions,
  ) {
    this.options = { ...Simplifier.defaultOptions, ...options }
  }

  /**
   * Simplifies a schema by first checking if its an object, if so, split it out and ref it based on id.
   * Index 0 will always be the input schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplifyRecursive(schema : ParsedSchema | boolean) : CommonModel[] {
    let models : CommonModel[] = [];
    let simplifiedModel = this.simplify(schema);
    if(simplifiedModel.length > 0){
      //Get the root model from the simplification process which is the first element in the list
      const schemaSimplifiedModel = simplifiedModel[0];
      //Only if the schema is of type object and contains properties, split it out
      if(schemaSimplifiedModel.type !== undefined && schemaSimplifiedModel.type.includes("object") && schemaSimplifiedModel.properties !== undefined){
        let switchRootModel = new CommonModel();
        switchRootModel.$ref = schemaSimplifiedModel.$id;
        models[0] = switchRootModel;
      }
      models = [...models, ...simplifiedModel];
    }
    return models;
  }


  /**
   * Simplifies a schema into instances of CommonModel. 
   * Index 0 will always be the input schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplify(schema : ParsedSchema | boolean) : CommonModel[] {
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
        let schemaId = schema.$id ? schema.$id : `anonymSchema${this.anonymCounter++}`;
        model.$id = schemaId;
      } else if (schema.$id !== undefined){
        model.$id = schema.$id;
      }

      const simplifiedItems = simplifyItems(schema, this);
      if(simplifiedItems.newModels !== undefined){
          models = [...models, ...simplifiedItems.newModels];
      }
      if(simplifiedItems.items !== undefined){
        model.items = simplifiedItems.items;
      }

      const simplifiedProperties = simplifyProperties(schema, this);
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
      if(this.options.allowInheritance){
        const simplifiedExtends = simplifyExtend(schema, this);
        if(simplifiedExtends.newModels !== undefined){
          models = [...models, ...simplifiedExtends.newModels];
        }
        if(simplifiedExtends.extendingSchemas !== undefined){
          model.extend = simplifiedExtends.extendingSchemas;
        }
      }
    }

    //Always ensure the model representing the input schema to be in index 0. 
    models = [model, ...models];
    return models;
  }
}