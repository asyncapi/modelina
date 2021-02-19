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

export class Simplifier {
  static defaultOptions: SimplificationOptions = {
    allowInheritance: true
  }
  options: SimplificationOptions;
  anonymCounter = 1;
  seenSchemas: Map<Schema, CommonModel> = new Map();
  iteratedModels: Record<string, CommonModel> = {};
  constructor(
    options: SimplificationOptions = Simplifier.defaultOptions,
  ) {
    this.options = { ...Simplifier.defaultOptions, ...options };
  }

  /**
   * Simplifies a schema into instances of CommonModel. 
   * Index 0 will always be the root schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplify(schema: Schema | boolean): CommonModel[] {
    const model = new CommonModel();
    if (typeof schema !== 'boolean' && this.seenSchemas.has(schema)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [this.seenSchemas.get(schema)!];
    }
    model.originalSchema = Schema.toSchema(schema);
    model.type = simplifyTypes(schema);
    if (typeof schema !== 'boolean') {
      this.seenSchemas.set(schema, model);
      this.simplifyModelProperties(model, schema);
    }
    this.ensureModelsAreSplit(model);
    const modelsToReturn = Object.values(this.iteratedModels);
    //Add models which have not been iterated before
    if (isModelObject(model) && this.iteratedModels[`${model.$id}`] === undefined) {
      this.iteratedModels[`${model.$id}`] = model;
    }
    return [model, ...modelsToReturn];
  }

  /**
   * Function to simplify all model properties from schema.
   * 
   * @param model to simplify properties to 
   * @param schema to simplify
   */
  private simplifyModelProperties(model: CommonModel, schema: Schema) {
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

    const simplifiedExtends = simplifyExtend(schema, this);
    if (simplifiedExtends !== undefined) {
      model.extend = simplifiedExtends;
    }

    const enums = simplifyEnums(schema);
    if (enums !== undefined && enums.length > 0) {
      model.enum = enums;
    }

    const required = simplifyRequired(schema);
    if (required !== undefined) {
      model.required = required;
    }
  }

  /**
  * This function splits up a model if needed and add the new model to the list of models.
  * 
  * @param model check if it should be split up
  * @param models which have already been split up
  */
  private splitModels(model: CommonModel): CommonModel {
    if (isModelObject(model)) {
      const switchRootModel = new CommonModel();
      switchRootModel.$ref = model.$id;
      this.iteratedModels[`${model.$id}`] = model;
      return switchRootModel;
    }
    return model;
  }

  /**
   * Split up all models which should and use ref instead.
   * 
   * @param model to ensure are split
   * @param models which are already split
   */
  private ensureModelsAreSplit(model: CommonModel) {
    if (model.properties) {
      const existingProperties = model.properties;
      for (const [prop, propSchema] of Object.entries(existingProperties)) {
        existingProperties[`${prop}`] = this.splitModels(propSchema);
      }
    }
    if (model.items) {
      const existingItem = model.items;
      model.items = this.splitModels(existingItem as CommonModel);
    }
    if (model.additionalProperties) {
      const existingAdditionalProperties = model.additionalProperties;
      model.additionalProperties = this.splitModels(existingAdditionalProperties as CommonModel);
    }
  }
}

/**
 * This is the default wrapper for the simplifier class which always create a new instance of the simplifier. 
 * 
 * @param schema to simplify
 */
export function simplify(schema: Schema | boolean): CommonModel[] {
  const simplifier = new Simplifier();
  return simplifier.simplify(schema);
}
