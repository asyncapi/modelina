import { CommonModel, Schema } from '../models';
import simplifyProperties from './SimplifyProperties';
import simplifyEnums from './SimplifyEnums';
import simplifyItems from './SimplifyItems';
import simplifyExtend from './SimplifyExtend';
import simplifyRequired from './SimplifyRequired';
import simplifyTypes from './SimplifyTypes';
import { SimplificationOptions } from '../models/SimplificationOptions';
import simplifyAdditionalProperties from './SimplifyAdditionalProperties';
import { isModelObject } from './Utils';
import simplifyName from './SimplifyName';

export class Simplifier {
  static defaultOptions: SimplificationOptions = {
    allowInheritance: true
  }

  private anonymCounter = 1;
  private seenSchemas: Map<Schema, CommonModel> = new Map();

  constructor(
    readonly options: SimplificationOptions = Simplifier.defaultOptions,
  ) {
    this.options = { ...Simplifier.defaultOptions, ...options };
  }

  /**
   * Simplifies a schema by first checking if its an object, if so, split it out and ref it based on id.
   * Index 0 will always be the input schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplifyRecursive(schema : Schema | boolean) : CommonModel[] {
    let models : CommonModel[] = [];
    const simplifiedModel = this.simplify(schema);
    if (simplifiedModel.length > 0) {
      //Get the root model from the simplification process which is the first element in the list
      const schemaSimplifiedModel = simplifiedModel[0];
      //Only if the schema is of type object and contains properties, split it out
      if (isModelObject(schemaSimplifiedModel)) {
        const switchRootModel = new CommonModel();
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
  simplify(schema : Schema | boolean) : CommonModel[] {
    let models : CommonModel[] = [];
    const model = new CommonModel();
    if (typeof schema !== 'boolean' && this.seenSchemas.has(schema)) {
      return [this.seenSchemas.get(schema)!];
    }

    model.originalSchema = Schema.toSchema(schema);
    model.type = simplifyTypes(schema);

    if (typeof schema !== 'boolean') {
      this.seenSchemas.set(schema, model);
      // All schemas of type object MUST have ids, for now lets make it simple
      if (model.type !== undefined && model.type.includes('object')) {
        const schemaId = schema.$id ? schema.$id : `anonymSchema${this.anonymCounter++}`;
        model.$id = schemaId;
      } else if (schema.$id !== undefined) {
        model.$id = schema.$id;
      }

      const name = simplifyName(schema, model.$id);
      if (name) {
        model.name = name;
      }

      const simplifiedItems = simplifyItems(schema, this);
      if (simplifiedItems.newModels !== undefined) {
        models = [...models, ...simplifiedItems.newModels];
      }
      if (simplifiedItems.items !== undefined) {
        model.items = simplifiedItems.items;
      }

      const simplifiedProperties = simplifyProperties(schema, this);
      if (simplifiedProperties.properties !== undefined) {
        model.properties = simplifiedProperties.properties;
      }
      if (simplifiedProperties.newModels !== undefined) {
        models = [...models, ...simplifiedProperties.newModels];
      }
      
      const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, this, model);
      if (simplifiedAdditionalProperties.newModels !== undefined) {
        models = [...models, ...simplifiedAdditionalProperties.newModels];
      }
      if (simplifiedAdditionalProperties.additionalProperties !== undefined) {
        model.additionalProperties = simplifiedAdditionalProperties.additionalProperties;
      }

      if (this.options.allowInheritance) {
        const simplifiedExtends = simplifyExtend(schema, this);
        if (simplifiedExtends.newModels !== undefined) {
          models = [...models, ...simplifiedExtends.newModels];
        }
        if (simplifiedExtends.extendingSchemas !== undefined) {
          model.extend = simplifiedExtends.extendingSchemas;
        }
      }

      const enums = simplifyEnums(schema);
      if (enums !== undefined && enums.length > 0) {
        if (model.enum) {
          model.enum = [...model.enum, ...enums];
        } else {
          model.enum = enums;
        }
      }

      const required = simplifyRequired(schema);
      if (required !== undefined) {
        model.required = required;
      }
    }

    //Always ensure the model representing the input schema to be in index 0. 
    models = [model, ...models];
    return models;
  }
}

/**
 * This is the default wrapper for the simplifier class which always create a new instance of the simplifier. 
 * 
 * @param schema to simplify
 */
export function simplify(schema : Schema | boolean) : CommonModel[] {
  const simplifier = new Simplifier();
  return simplifier.simplify(schema);
}
