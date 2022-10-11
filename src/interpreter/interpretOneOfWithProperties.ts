import { CommonModel } from '../models/CommonModel';
import { Interpreter, InterpreterOptions, InterpreterSchemaType } from './Interpreter';

/**
 * Interpreter function for oneOf keyword with properties.
 * 
 * It puts the schema reference into the items field.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOfWithProperties(schema: InterpreterSchemaType, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (
    typeof schema === 'boolean' ||
    !schema.oneOf ||
    !schema.properties ||
    schema.allOf
  ) { 
    return; 
  }
  
  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
    
    if (!oneOfModel) { 
      continue; 
    }

    if (typeof schema === 'boolean' || !schema.properties) {
      continue;
    }
  
    const schemaModel = interpreter.interpret({
      ...schema,
      oneOf: undefined
    }, interpreterOptions);
  
    if (!schemaModel) {
      continue;
    }
  
    interpreter.interpretAndCombineSchema(oneOfSchema, schemaModel, schema, interpreterOptions);
    model.setType(undefined);
    schemaModel.$id = oneOfModel.$id;
  
    model.addItemUnion(schemaModel);
  }
}
