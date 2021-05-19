import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 allOf keyword.
 * 
 * It either merges allOf schemas into existing model or if allowed, create inheritance.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 */
export default function interpretAllOf(schema: Schema | boolean, model: CommonModel, interpreter : Interpreter) {
  if (typeof schema === 'boolean' || schema.allOf === undefined) return;
  
  for (const allOfSchema of (schema.allOf)) {  
    const simplifiedModels = interpreter.interpret(allOfSchema);
    if (simplifiedModels.length > 0) {
      const rootSimplifiedModel = simplifiedModels[0];
      if (isModelObject(rootSimplifiedModel) && interpreter.options.allowInheritance === true) {
        if (model.extend === undefined) model.extend = [];
        model.extend.push(`${rootSimplifiedModel.$id}`);
      } else {
        interpreter.combineSchemas(allOfSchema, model, schema);
      }
    }
  }
}
