import { CommonModel, Schema } from '../models';
import { interpretName } from './Utils';
import interpretProperties from './InterpretProperties';
import interpretAllOf from './InterpretAllOf';
import interpretConst from './InterpretConst';
import interpretEnum from './InterpretEnum';
import interpretAdditionalProperties from './InterpretAdditionalProperties';
import interpretItems from './InterpretItems';
import interpretPatternProperties from './InterpretPatternProperties';
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
  
  /**
   * Transforms a schema into instances of CommonModel by processing all JSON Schema draft 7 keywords and infers the model definition.
   * 
   * @param schema
   * @param options to control the interpret process
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
   */
  combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentModel: CommonModel, rootSchema: Schema, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
    if (typeof schema !== 'object') {return;}
    if (Array.isArray(schema)) {
      schema.forEach((forEachSchema) => {
        this.combineSchemas(forEachSchema, currentModel, rootSchema, interpreterOptions);
      });
    } else {
      interpreterOptions = {...interpreterOptions, splitModels: false};
      const model = this.interpret(schema, interpreterOptions);
      if (model !== undefined) {
        CommonModel.mergeCommonModels(currentModel, model, rootSchema);
      }
    }
  }
}
