
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 items keyword.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 */
export default function interpretItems(schema: Schema | boolean, model: CommonModel, interpreter : Interpreter) {
  if (typeof schema === 'boolean' || schema.items === undefined) return;
  model.addTypes('array');
  interpretArrayItems(schema, schema.items, model, interpreter);
}

/**
 * Internal function to process all item schemas
 *  
 * @param rootSchema 
 * @param itemSchemas 
 * @param model 
 * @param interpreter 
 */
function interpretArrayItems(rootSchema: Schema, itemSchemas: (Schema | boolean)[] | (Schema | boolean), model: CommonModel, interpreter : Interpreter) {
  if (Array.isArray(itemSchemas)) {
    for (const itemSchema of itemSchemas) {
      interpretArrayItems(rootSchema, itemSchema, model, interpreter);
    }
  } else {
    const itemModels = interpreter.interpret(itemSchemas);
    if (itemModels.length > 0) {
      if (model.items) {
        model.items = CommonModel.mergeCommonModels(model.items as CommonModel, itemModels[0], rootSchema);
      } else {
        model.items = itemModels[0];
      }
    }
  }
}
