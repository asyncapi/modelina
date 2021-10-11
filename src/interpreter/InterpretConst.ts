import { Draft4Schema } from '../models/Draft4Schema';
import { CommonModel } from '../models/CommonModel';
import { InterpreterSchemaType } from './Interpreter';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for const keyword for draft version > 4
 * 
 * @param schema 
 * @param model
 */
export default function interpretConst(schema: InterpreterSchemaType, model: CommonModel): void {
  const isDraft04 = schema instanceof Draft4Schema;

  if (isDraft04 || typeof schema === 'boolean' || schema.const === undefined) {return;}
  
  const schemaConst = schema.const;
  model.enum = [schemaConst];

  //If schema does not contain type interpret the schema
  if (schema.type === undefined) {
    const inferredType = inferTypeFromValue(schemaConst);
    if (inferredType !== undefined) {
      model.setType(inferredType);
    }
  }
}
