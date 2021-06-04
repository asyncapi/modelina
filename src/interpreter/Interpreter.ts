import { CommonModel, Schema } from '../models';
import { interpretName, isModelObject } from './Utils';
import interpretProperties from './InterpretProperties';
import interpretAllOf from './InterpretAllOf';
import interpretConst from './InterpretConst';
import interpretEnum from './InterpretEnum';
import interpretAdditionalProperties from './InterpretAdditionalProperties';
import interpretItems from './InterpretItems';
import interpretPatternProperties from './InterpretPatternProperties';
import { Logger } from '../utils';
import interpretNot from './InterpretNot';

export type InterpreterOptions = {
  splitModels?: boolean,
  allowInheritance?: boolean
} 
export class Interpreter {
  static defaultInterpreterOptions: InterpreterOptions = {
    splitModels: true,
    allowInheritance: false
  }

  private anonymCounter = 1;
  private seenSchemas: Map<Schema | boolean, CommonModel> = new Map();
  private iteratedModels: Record<string, CommonModel> = {};
  
  /**
   * Transforms a schema into instances of CommonModel by processing all JSON Schema draft 7 keywords and infers the model definition.
   *  
   * length == 0 means no model can be generated from the schema
   * Index 0 will always be the root schema CommonModel representation.
   * Index > 0 will always be the separated models that the interpreter determines are fit to be on their own.
   * 
   * @param schema
   * @param options to control the interpret process
   */
  interpret(schema: Schema | boolean, options: InterpreterOptions = Interpreter.defaultInterpreterOptions): CommonModel[] {
    if (this.seenSchemas.has(schema)) {
      const cachedModel = this.seenSchemas.get(schema); 
      if (cachedModel !== undefined) {
        return [cachedModel, ...Object.values(this.iteratedModels)];
      }
    }
    //If it is a false validation schema return no CommonModel
    if (schema === false) {
      return [];
    } 
    const model = new CommonModel();
    model.originalSchema = Schema.toSchema(schema);
    this.seenSchemas.set(schema, model);
    this.interpretSchema(model, schema, options);
    const modelsToReturn = Object.values(this.iteratedModels);
    if (options.splitModels === true) {
      this.ensureModelsAreSplit(model);
      if (isModelObject(model)) {
        this.iteratedModels[String(model.$id)] = model;
      }
    }
    return [model, ...modelsToReturn];
  }

  /**
   * Function to interpret the JSON schema draft 7 into a CommonModel.
   * 
   * @param model 
   * @param schema 
   * @param options to control the interpret process
   */
  private interpretSchema(model: CommonModel, schema: Schema | boolean, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions) {
    if (schema === true) {
      model.setType(['object', 'string', 'number', 'array', 'boolean', 'null', 'integer']);
    } else if (typeof schema === 'object') {
      if (schema.type !== undefined) {
        model.addTypes(schema.type);
      }

      //All schemas of type object MUST have ids
      if (model.type !== undefined && model.type.includes('object')) {
        model.$id = interpretName(schema) || `anonymSchema${this.anonymCounter++}`;
      } else if (schema.$id !== undefined) {
        model.$id = interpretName(schema);
      }

      model.required = schema.required || model.required;
      
      interpretPatternProperties(schema, model, this, interpreterOptions);
      interpretAdditionalProperties(schema, model, this, interpreterOptions);
      interpretItems(schema, model, this, interpreterOptions);
      interpretProperties(schema, model, this, interpreterOptions);
      interpretAllOf(schema, model, this, interpreterOptions);
      interpretConst(schema, model);
      interpretEnum(schema, model);

      this.interpretAndCombineMultipleSchemas(schema.oneOf, model, schema, interpreterOptions);
      this.interpretAndCombineMultipleSchemas(schema.anyOf, model, schema, interpreterOptions);
      this.interpretAndCombineSchema(schema.then, model, schema, interpreterOptions);
      this.interpretAndCombineSchema(schema.else, model, schema, interpreterOptions);

      interpretNot(schema, model, this, interpreterOptions);
    }
  }

  /**
   * Go through a schema and combine the interpreted models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   * @param rootSchema the root schema to use as original schema when merged
   * @param options to control the interpret process
   */
  interpretAndCombineSchema(schema: (Schema | boolean) | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (typeof schema !== 'object') {return;}
    interpreterOptions = {...interpreterOptions, splitModels: false};
    const models = this.interpret(schema, interpreterOptions);
    if (models.length > 0) {
      CommonModel.mergeCommonModels(currentModel, models[0], rootSchema);
    }
  }

  /**
   * Go through multiple schemas and combine the interpreted models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   * @param rootSchema the root schema to use as original schema when merged
   * @param options to control the interpret process
   */
  interpretAndCombineMultipleSchemas(schema: (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (!Array.isArray(schema)) { return; }
    for (const forEachSchema of schema) {
      this.interpretAndCombineSchema(forEachSchema, currentModel, rootSchema, interpreterOptions);
    }
  }

  /**
  * This function splits up a model if it is determined it should.
  * 
  * @param model check if it should be split up
  */
  private trySplitModels(model: CommonModel): CommonModel {
    if (isModelObject(model)) {
      Logger.info(`Splitting model ${model.$id || 'any'} since it should be on its own`);
      const switchRootModel = new CommonModel();
      switchRootModel.$ref = model.$id;
      this.iteratedModels[String(model.$id)] = model;
      return switchRootModel;
    }
    return model;
  }

  /**
   * Split up all model which should be and use $ref instead.
   * 
   * @param model
   */
  ensureModelsAreSplit(model: CommonModel): void {
    if (model.properties) {
      const existingProperties = model.properties;
      for (const [property, propertyModel] of Object.entries(existingProperties)) {
        model.properties[String(property)] = this.trySplitModels(propertyModel);
      }
    }
    if (model.patternProperties) {
      const existingPatternProperties = model.patternProperties;
      for (const [pattern, patternModel] of Object.entries(existingPatternProperties)) {
        model.patternProperties[String(pattern)] = this.trySplitModels(patternModel);
      }
    }
    if (model.additionalProperties) {
      model.additionalProperties = this.trySplitModels(model.additionalProperties);
    }
    if (model.items) {
      let existingItems = model.items;
      if (Array.isArray(existingItems)) {
        for (const [itemIndex, itemModel] of existingItems.entries()) {
          existingItems[Number(itemIndex)] = this.trySplitModels(itemModel);
        }
      } else {
        existingItems = this.trySplitModels(existingItems);
      }
      model.items = existingItems;
    }
  }
}
