import { CommonModel, Schema } from '../models';
import { interpretName, isEnum, isModelObject } from './Utils';
import interpretProperties from './InterpretProperties';
import interpretAllOf from './InterpretAllOf';
import interpretConst from './InterpretConst';
import interpretEnum from './InterpretEnum';
import interpretAdditionalProperties from './InterpretAdditionalProperties';
import interpretItems from './InterpretItems';
import interpretPatternProperties from './InterpretPatternProperties';
import interpretNot from './InterpretNot';
import interpretDependencies from './InterpretDependencies';
import interpretAdditionalItems from './InterpretAdditionalItems';

export type InterpreterOptions = {
  allowInheritance?: boolean
} 
export class Interpreter {
  static defaultInterpreterOptions: InterpreterOptions = {
    allowInheritance: false
  }

  private anonymCounter = 1;
  private seenSchemas: Map<Schema | boolean, CommonModel> = new Map();
  
  /**
   * Transforms a schema into instances of CommonModel by processing all JSON Schema draft 7 keywords and infers the model definition.
   * 
   * @param schema
   * @param interpreterOptions to control the interpret process
   */
  interpret(schema: Schema | boolean, options: InterpreterOptions = Interpreter.defaultInterpreterOptions): CommonModel | undefined {
    if (this.seenSchemas.has(schema)) {
      const cachedModel = this.seenSchemas.get(schema); 
      if (cachedModel !== undefined) {
        return cachedModel;
      }
    }
    //If it is a false validation schema return no CommonModel
    if (schema === false) {
      return undefined;
    } 
    const model = new CommonModel();
    model.originalSchema = Schema.toSchema(schema);
    this.seenSchemas.set(schema, model);
    this.interpretSchema(model, schema, options);
    return model;
  }

  /**
   * Function to interpret the JSON schema draft 7 into a CommonModel.
   * 
   * @param model 
   * @param schema 
   * @param interpreterOptions to control the interpret process
   */
  private interpretSchema(model: CommonModel, schema: Schema | boolean, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions) {
    if (schema === true) {
      model.setType(['object', 'string', 'number', 'array', 'boolean', 'null', 'integer']);
    } else if (typeof schema === 'object') {
      if (schema.type !== undefined) {
        model.addTypes(schema.type);
      }
      model.required = schema.required || model.required;

      interpretPatternProperties(schema, model, this, interpreterOptions);
      interpretAdditionalProperties(schema, model, this, interpreterOptions);
      interpretAdditionalItems(schema, model, this, interpreterOptions);
      interpretItems(schema, model, this, interpreterOptions);
      interpretProperties(schema, model, this, interpreterOptions);
      interpretAllOf(schema, model, this, interpreterOptions);
      interpretDependencies(schema, model, this, interpreterOptions);
      interpretConst(schema, model);
      interpretEnum(schema, model);

      this.interpretAndCombineMultipleSchemas(schema.oneOf, model, schema, interpreterOptions);
      this.interpretAndCombineMultipleSchemas(schema.anyOf, model, schema, interpreterOptions);
      this.interpretAndCombineSchema(schema.then, model, schema, interpreterOptions);
      this.interpretAndCombineSchema(schema.else, model, schema, interpreterOptions);

      interpretNot(schema, model, this, interpreterOptions);

      //All schemas of type model object or enum MUST have ids
      if (isModelObject(model) === true || isEnum(model) === true) {
        model.$id = interpretName(schema) || `anonymSchema${this.anonymCounter++}`;
      } else if (schema.$id !== undefined) {
        model.$id = interpretName(schema);
      }
    }
  }

  /**
   * Go through a schema and combine the interpreted models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   * @param rootSchema the root schema to use as original schema when merged
   * @param interpreterOptions to control the interpret process
   */
  interpretAndCombineSchema(schema: (Schema | boolean) | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (typeof schema !== 'object') {return;}
    const model = this.interpret(schema, interpreterOptions);
    if (model !== undefined) {
      CommonModel.mergeCommonModels(currentModel, model, rootSchema);
    }
  }

  /**
   * Go through multiple schemas and combine the interpreted models together.
   * 
   * @param schema to go through
   * @param currentModel the current output
   * @param rootSchema the root schema to use as original schema when merged
   * @param interpreterOptions to control the interpret process
   */
  interpretAndCombineMultipleSchemas(schema: (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (!Array.isArray(schema)) { return; }
    for (const forEachSchema of schema) {
      this.interpretAndCombineSchema(forEachSchema, currentModel, rootSchema, interpreterOptions);
    }
  }
}
