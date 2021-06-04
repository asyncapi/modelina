
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 items keyword.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param options to control the interpret process
 */
export default function interpretItems(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (schema.items === undefined) {return;}
  model.addTypes('array');
  interpretArrayItems(schema, schema.items, model, interpreter, interpreterOptions);
}

/**
 * Internal function to process all item schemas
 *  
 * @param rootSchema 
 * @param itemSchemas 
 * @param model 
 * @param interpreter 
 * @param options to control the interpret process
 */
function interpretArrayItems(rootSchema: Schema, itemSchemas: (Schema | boolean)[] | (Schema | boolean), model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (Array.isArray(itemSchemas)) {
    for (const itemSchema of itemSchemas) {
      interpretArrayItems(rootSchema, itemSchema, model, interpreter, interpreterOptions);
    }
  } else {
    const itemModel = interpreter.interpret(itemSchemas, interpreterOptions);
    if (itemModel !== undefined) {
      model.addItem(itemModel, rootSchema);
    }
  }
}
