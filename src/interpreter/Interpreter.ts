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
    const modelsToReturn = Object.values(this.iteratedModels);
    if (this.seenSchemas.has(schema)) {
      const cachedModel = this.seenSchemas.get(schema); 
      if (cachedModel !== undefined) {
        return [cachedModel, ...modelsToReturn];
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

      this.combineSchemas(schema.oneOf, model, schema, interpreterOptions);
      this.combineSchemas(schema.anyOf, model, schema, interpreterOptions);
      this.combineSchemas(schema.then, model, schema, interpreterOptions);
      this.combineSchemas(schema.else, model, schema, interpreterOptions);

      interpretNot(schema, model, this, interpreterOptions);
    }
  }

  /**
   * Go through schema(s) and combine the interpreted models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   * @param options to control the interpret process
   */
  combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (typeof schema !== 'object') {return;}
    if (Array.isArray(schema)) {
      schema.forEach((forEachSchema) => {
        this.combineSchemas(forEachSchema, currentModel, rootSchema, interpreterOptions);
      });
    } else {
      interpreterOptions = {...interpreterOptions, splitModels: false};
      const models = this.interpret(schema, interpreterOptions);
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
      Logger.info(`Splitting model ${model.$id || 'any'} since it should be on its own`);
      const switchRootModel = new CommonModel();
      switchRootModel.$ref = model.$id;
      this.iteratedModels[String(model.$id)] = model;
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
  ensureModelsAreSplit(model: CommonModel): void {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (model.properties) {
      const existingProperties = model.properties;
      for (const [prop, propSchema] of Object.entries(existingProperties)) {
        model.properties[String(prop)] = this.splitModels(propSchema);
      }
    }
  }
}
