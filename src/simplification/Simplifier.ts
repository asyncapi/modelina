
import { CommonModel, Schema } from '../models';
import simplifyProperties from './SimplifyProperties';
import simplifyEnums from './SimplifyEnums';
import simplifyTypes from './SimplifyTypes';
import simplifyItems from './SimplifyItems';
import simplifyExtend from './SimplifyExtend';
import { SimplificationOptions } from '../models/SimplificationOptions';
import simplifyAdditionalProperties from './SimplifyAdditionalProperties';

export class Simplifier {
  static defaultOptions: SimplificationOptions = {
    allowInheritance: true
  }
  options: SimplificationOptions;
  anonymCounter = 1;
  seenSchemas: Map<Schema, CommonModel> = new Map();
  existingModels: CommonModel[] = [];
  constructor(
    options: SimplificationOptions = Simplifier.defaultOptions,
  ) {
    this.options = { ...Simplifier.defaultOptions, ...options };
  }

  /**
   * Simplifies a schema into instances of CommonModel. 
   * Index 0 will always be the input schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplify(schema : Schema | boolean) : CommonModel[] {
    const model = new CommonModel();
    if (typeof schema !== 'boolean' && this.seenSchemas.has(schema)) {
      return [this.seenSchemas.get(schema)!];
    }
    model.originalSchema = Schema.toSchema(schema);
    const simplifiedTypes = simplifyTypes(schema);
    if (simplifiedTypes !== undefined) {
      model.type = simplifiedTypes;
    }
    if (typeof schema !== 'boolean') {
      this.seenSchemas.set(schema, model);
      //All schemas of type object MUST have ids, for now lets make it simple
      if (model.type !== undefined && model.type.includes('object')) {
        const schemaId = schema.$id ? schema.$id : `anonymSchema${this.anonymCounter++}`;
        model.$id = schemaId;
      } else if (schema.$id !== undefined) {
        model.$id = schema.$id;
      }

      const simplifiedItems = simplifyItems(schema, this);
      if (simplifiedItems !== undefined) {
        model.items = simplifiedItems;
      }

      const simplifiedProperties = simplifyProperties(schema, this);
      if (simplifiedProperties !== undefined) {
        model.properties = simplifiedProperties;
      }
      
      const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, this, model);
      if (simplifiedAdditionalProperties !== undefined) {
        model.additionalProperties = simplifiedAdditionalProperties;
      }

      if (this.options.allowInheritance) {
        const simplifiedExtends = simplifyExtend(schema, this);
        if (simplifiedExtends !== undefined) {
          model.extend = simplifiedExtends;
        }
      }

      const enums = simplifyEnums(schema);
      if (enums !== undefined && enums.length > 0) {
        model.enum = enums;
      }
    }

    //Always ensure the model representing the input schema to be in index 0. 
    this.existingModels = [model, ...this.existingModels, ...splitModels(model)];
    return this.existingModels;
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

/**
 * check if CommonModel is a separate model or a simple model.
 */
export function isModelObject(model: CommonModel) : boolean {
  // This check should be done instead, needs a refactor to allow it though:
  // this.extend !== undefined || this.properties !== undefined
  if (model.type !== undefined) {
    // If all possible JSON types are defined, don't split it even if it does contain object.
    if (Array.isArray(model.type) && model.type.length === 6) {
      return false;
    }
    return model.type.includes('object');
  }
  return false;
}

/**
 * 
 * @param model to ensure are split up correctly
 * @param models which have already been split up
 */
function ensureModelsAreSplit(model: CommonModel, models: CommonModel[]) : CommonModel {
  if (isModelObject(model)) {
    const switchRootModel = new CommonModel();
    switchRootModel.$ref = model.$id;
    models.push(model);
    return switchRootModel;
  }
  return model;
}

function splitModels(model: CommonModel, models: CommonModel[] = []) : CommonModel[] {
  if (model.properties) {
    const existingProperties = model.properties;
    for (const [prop, propSchema] of Object.entries(existingProperties)) {
      existingProperties[`${prop}`] = ensureModelsAreSplit(propSchema, models);
    }
  }
  if (model.items) {
    const existingItem = model.items;
    model.items = ensureModelsAreSplit(existingItem as CommonModel, models);
  }
  if (model.additionalProperties) {
    const existingAdditionalProperties = model.additionalProperties;
    model.additionalProperties = ensureModelsAreSplit(existingAdditionalProperties as CommonModel, models);
  }
  return models;
}
