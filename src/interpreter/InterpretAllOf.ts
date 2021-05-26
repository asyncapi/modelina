import { Logger } from '../utils';
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 allOf keyword.
 * 
 * It either merges allOf schemas into existing model or if allowed, create inheritance.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param options to control the interpret process
 */
export default function interpretAllOf(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions) {
  if (schema.allOf === undefined) return;

  for (const allOfSchema of schema.allOf) {  
    const interpretedModels = interpreter.interpret(allOfSchema);
    if (interpretedModels.length === 0) continue;
    const interpretedModel = interpretedModels[0];
    if (isModelObject(interpretedModel) && interpreterOptions.allowInheritance === true) {
      Logger.info(`Processing allOf, inheritance is enabled, ${model.$id} inherits from ${interpretedModel.$id}`, model, interpretedModel);
      model.addExtendedModel(interpretedModel);
    } else {
      Logger.info('Processing allOf, inheritance is not enabled. AllOf model is merged together with already interpreted model', model, interpretedModel);
      interpreter.combineSchemas(allOfSchema, model, schema, interpreterOptions);
    }
  }
}
