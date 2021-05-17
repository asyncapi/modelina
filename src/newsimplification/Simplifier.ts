import { CommonModel, Schema } from '../models';
import { SimplificationOptions } from '../models/SimplificationOptions';
import { simplifyName, isModelObject } from './Utils';
import simplifyProperties from './SimplifyProperties';
import { Logger } from '../utils';

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
    const modelsToReturn = Object.values(this.iteratedModels);
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
    if (isModelObject(model)) {
      this.iteratedModels[`${model.$id}`] = model;
    }
    return [model, ...modelsToReturn];
  }

  /**
   * Function to simplify schema into a model.
   * 
   * @param model to simplify to simplify schema into 
   * @param schema to simplify
   */
  private simplifyModel(model: CommonModel, schema: Schema) {
    if (schema.type !== undefined) {
      model.addTypes(schema.type);
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

    this.combineSchemas(schema.oneOf, model, schema);
    this.combineSchemas(schema.anyOf, model, schema);
    this.combineSchemas(schema.then, model, schema);
    this.combineSchemas(schema.else, model, schema);
  }

  /**
   * Go through schema(s) and combine the simplified models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   */
  combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema) {
    if (typeof schema !== 'object') return;
    if (Array.isArray(schema)) {
      schema.forEach((forEachSchema) => {
        this.combineSchemas(forEachSchema, currentModel, rootSchema);
      });
    } else {
      const models = this.simplify(schema, false);
      if (models.length > 0) {
        CommonModel.mergeCommonModels(currentModel, models[0], rootSchema);
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
      Logger.info(`Splitting model ${model.$id || 'unknown'} since it should be on its own`);
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
  ensureModelsAreSplit(model: CommonModel) {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (model.properties) {
      const existingProperties = model.properties;
      for (const [prop, propSchema] of Object.entries(existingProperties)) {
        model.properties[`${prop}`] = this.splitModels(propSchema);
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
