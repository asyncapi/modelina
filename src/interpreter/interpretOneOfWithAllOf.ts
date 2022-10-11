import { CommonModel } from '../models/CommonModel';
import { Interpreter, InterpreterOptions, InterpreterSchemaType } from './Interpreter';

/**
 * Interpreter function for oneOf keyword with allOf.
 * 
 * It puts the schema reference into the items field.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOfWithAllOf(schema: InterpreterSchemaType, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (
    typeof schema === 'boolean' ||
    !schema.oneOf ||
    !schema.allOf ||
    schema.properties ||
    interpreterOptions.allowInheritance
  ) { 
    return; 
  }

  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);

    if (!oneOfModel) { 
      continue; 
    }
    
    if (typeof schema === 'boolean' || !schema.allOf?.length) {
      continue;
    }
  
    const [firstAllOfSchema, ...allOfSchemas] = schema.allOf;
  
    if (typeof firstAllOfSchema === 'boolean') {
      continue;
    }
  
    const allOfModel = interpreter.interpret({ ...firstAllOfSchema }, interpreterOptions);
  
    if (!allOfModel) {
      continue;
    }
  
    for (const allOfSchema of allOfSchemas) {
      interpreter.interpretAndCombineSchema(allOfSchema, allOfModel, firstAllOfSchema, interpreterOptions);
    }
  
    interpreter.interpretAndCombineSchema(oneOfSchema, allOfModel, firstAllOfSchema, interpreterOptions);
    allOfModel.$id = oneOfModel.$id;
  
    model.addItemUnion(allOfModel);
  }
}
