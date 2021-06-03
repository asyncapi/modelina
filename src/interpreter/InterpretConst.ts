
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 const keyword.
 * 
 * @param schema 
 * @param model
 */
export default function interpretConst(schema: Schema, model: CommonModel): void {
  if (schema.const === undefined) {return;}
  
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
