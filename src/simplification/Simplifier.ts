
import { CommonModel, Schema } from '../models';
import simplifyProperties from './SimplifyProperties';
import simplifyEnums from './SimplifyEnums';
import simplifyTypes from './SimplifyTypes';
import simplifyItems from './SimplifyItems';
import simplifyExtend from './SimplifyExtend';
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
  existingModels: CommonModel[] = [];
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
  simplify(schema : Schema | boolean) : CommonModel[] {
    const model = new CommonModel();
    if (typeof schema !== 'boolean' && this.seenSchemas.has(schema)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [this.seenSchemas.get(schema)!];
    }
    let localModelsToAdd: CommonModel[] = [];
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
        if (simplifiedExtends.extendingSchemas !== undefined) {
          model.extend = simplifiedExtends.extendingSchemas;
        }
        if (simplifiedExtends.newModels !== undefined) {
          localModelsToAdd = [...localModelsToAdd, ...simplifiedExtends.newModels];
        }
      }

      const enums = simplifyEnums(schema);
      if (enums !== undefined && enums.length > 0) {
        model.enum = enums;
      }
    }
    this.ensureModelsAreSplit(model);
    return [model, ...this.existingModels, ...localModelsToAdd];
  }

  /**
   * 
   * @param model to ensure are split
   * @param models which are already split
   */
  private ensureModelsAreSplit(model: CommonModel) {
    /**
    * This function splits up a model if needed and add the new model to the list of models.
    * 
    * @param model check if it should be split up
    * @param models which have already been split up
    */
    const splitModels = (model: CommonModel) : CommonModel => {
      if (isModelObject(model)) {
        const switchRootModel = new CommonModel();
        switchRootModel.$ref = model.$id;
        this.existingModels.push(model);
        return switchRootModel;
      }
      return model;
    };
    if (model.properties) {
      const existingProperties = model.properties;
      for (const [prop, propSchema] of Object.entries(existingProperties)) {
        existingProperties[`${prop}`] = splitModels(propSchema);
      }
    }
    if (model.items) {
      const existingItem = model.items;
      model.items = splitModels(existingItem as CommonModel);
    }
    if (model.additionalProperties) {
      const existingAdditionalProperties = model.additionalProperties;
      model.additionalProperties = splitModels(existingAdditionalProperties as CommonModel);
    }
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
