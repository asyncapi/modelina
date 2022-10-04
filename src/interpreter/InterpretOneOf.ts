import { CommonModel } from '../models/CommonModel';
import { Interpreter, InterpreterOptions, InterpreterSchemaType } from './Interpreter';

/**
 * Interpreter function for oneOf keyword with allOf
 * 
 * It puts the schema reference into the items field.
 * 
 * @param oneOfSchema 
 * @param oneOfModel 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param interpreterOptions to control the interpret process
 */
function interpretOneOfWithAllOf(
  oneOfSchema: InterpreterSchemaType, 
  oneOfModel: CommonModel, 
  schema: InterpreterSchemaType, 
  model: CommonModel, 
  interpreter : Interpreter, 
  interpreterOptions: InterpreterOptions
) {
  if (typeof schema === 'boolean' || !schema.allOf?.length) {
    return;
  }

  const [firstAllOfSchema, ...allOfSchemas] = schema.allOf;

  if (typeof firstAllOfSchema === 'boolean') {
    return;
  }

  const allOfModel = interpreter.interpret({ ...firstAllOfSchema }, interpreterOptions);

  if (!allOfModel) {
    return;
  }

  for (const allOfSchema of allOfSchemas) {
    interpreter.interpretAndCombineSchema(allOfSchema, allOfModel, firstAllOfSchema, interpreterOptions);
  }

  interpreter.interpretAndCombineSchema(oneOfSchema, allOfModel, firstAllOfSchema, interpreterOptions);
  allOfModel.$id = oneOfModel.$id;

  model.addItemUnion(allOfModel);
}

/**
 * Interpreter function for oneOf keyword.
 * 
 * It puts the schema reference into the items field.
 * 
 * @param schema 
 * @param model 
 * @param interpreter 
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOf(schema: InterpreterSchemaType, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (typeof schema === 'boolean' || schema.oneOf === undefined) { return; }
  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
    if (oneOfModel === undefined) { continue; }

    if (schema.allOf) {
      interpretOneOfWithAllOf(oneOfSchema, oneOfModel, schema, model, interpreter, interpreterOptions);
    } else {
      model.addItemUnion(oneOfModel);
    }
  }
}
