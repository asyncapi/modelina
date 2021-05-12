/* eslint-disable security/detect-object-injection */
import { CommonModel, Schema } from '../models';
import { SimplificationOptions } from '../models/SimplificationOptions';
import { simplifyName, isModelObject } from './Utils';
import simplifyItems from './SimplifyItems';
import simplifyEnums from './SimplifyEnums';
import simplifyConst from './SimplifyConst';
import simplifyAdditionalProperties from './SimplifyAdditionalProperties';
import simplifyPatternProperties from './SimplifyPatternProperties';
import simplifyProperties from './SimplifyProperties';
import simplifyNot from './SimplifyNot';

export class Simplifier {
  static defaultOptions: SimplificationOptions = {
    allowInheritance: false
  }

  private anonymCounter = 1;
  private seenSchemas: Map<Schema, CommonModel> = new Map();
  private iteratedModels: Record<string, CommonModel> = {};
  
  constructor(
    readonly options: SimplificationOptions = Simplifier.defaultOptions,
  ) {
    this.options = { ...Simplifier.defaultOptions, ...options };
  }

  /**
   * Simplifies a schema into instances of CommonModel. 
   * Index 0 will always be the root schema CommonModel representation
   * 
   * @param schema to simplify
   */
  simplify(schema: Schema | boolean, splitModels = true): CommonModel[] {
    if (typeof schema !== 'boolean' && this.seenSchemas.has(schema)) {
      const cachedModel = this.seenSchemas.get(schema); 
      if (cachedModel !== undefined) {
        return [cachedModel];
      }
    }
    //If it is a false validation schema return no common model
    if (schema === false) {
      return [];
    }
    const model = new CommonModel();
    model.originalSchema = Schema.toSchema(schema);
    if (schema === true) {
      model.setType(['object', 'string', 'number', 'array', 'boolean', 'null', 'integer']);
    }
    if (typeof schema !== 'boolean') {
      this.seenSchemas.set(schema, model);
      this.simplifyModel(model, schema);
    }
    if (splitModels) {
      this.ensureModelsAreSplit(model);
    }
    //Ensure current model is not part of the iterated list since we could have circular schemas that enable this
    if (this.iteratedModels[`${model.$id}`] !== undefined) {
      delete this.iteratedModels[`${model.$id}`];
    }
    const modelsToReturn = Object.values(this.iteratedModels);
    if (splitModels) {
      //Add models to ensure we remember which has been iterated 
      if (isModelObject(model)) {
        this.iteratedModels[`${model.$id}`] = model;
      }
    }
    return [model, ...modelsToReturn];
  }

  /**
   * Function to simplify all model properties from schema.
   * 
   * @param model to simplify properties to 
   * @param schema to simplify
   */
  private simplifyModel(model: CommonModel, schema: Schema) {
    if (schema.type !== undefined) {
      model.type = schema.type;
    }

    //All schemas of type object MUST have ids
    if (model.type !== undefined && model.type.includes('object')) {
      model.$id = simplifyName(schema) || `anonymSchema${this.anonymCounter++}`;
    } else if (schema.$id !== undefined) {
      model.$id = simplifyName(schema);
    }

    if (typeof schema !== 'boolean' && schema.required !== undefined) {
      model.required = schema.required;
    }

    simplifyProperties(schema, model, this);
    simplifyAdditionalProperties(schema, model, this);
    simplifyPatternProperties(schema, model, this);
    simplifyItems(schema, model, this);
    simplifyEnums(schema, model);

    this.combineSchemas(schema.allOf, model, schema);
    this.combineSchemas(schema.oneOf, model, schema);
    this.combineSchemas(schema.anyOf, model, schema);
    this.combineSchemas(schema.then, model, schema);
    this.combineSchemas(schema.else, model, schema);
    simplifyConst(schema, model);

    //Apply not validations
    simplifyNot(schema, model);
  }

  /**
   * Go through schema(s) and combine the simplified models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   */
  private combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema) {
    if (typeof schema !== 'object') return;
    if (Array.isArray(schema)) {
      schema.forEach((forEachSchema) => {
        this.combineSchemas(forEachSchema, currentModel, rootSchema);
      });
    } else {
      const models = this.simplify(schema, false);
      if (models.length > 0) {
        const model = models[0];
        CommonModel.mergeCommonModels(currentModel, model, rootSchema);
      }
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
        model.properties[`${prop}`] = this.splitModels(propSchema);
      }
    }
    if (model.items) {
      const existingItem = model.items;
      model.items = this.splitModels(existingItem as CommonModel);
    }
    if (model.additionalProperties) {
      const existingAdditionalProperties = model.additionalProperties;
      model.additionalProperties = this.splitModels(existingAdditionalProperties);
    }
    if (model.patternProperties) {
      const existingPatternProperties = model.patternProperties;
      for (const [pattern, patternModel] of Object.entries(existingPatternProperties)) {
        model.patternProperties[`${pattern}`] = this.splitModels(patternModel);
      }
    }
  }
}

/**
 * This is the default wrapper for the simplifier class which always create a new instance of the simplifier. 
 * 
 * @param schema to simplify
 */
export function simplify(schema: Schema | boolean, options?: SimplificationOptions): CommonModel[] {
  const simplifier = new Simplifier(options);
  return simplifier.simplify(schema);
}
