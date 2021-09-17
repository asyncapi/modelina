import { CommonModel } from '../models/CommonModel';
import { interpreterSchemaType } from './Interpreter';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for const keyword.
 * 
 * @param schema 
 * @param model
 */
export default function interpretConst(schema: interpreterSchemaType, model: CommonModel): void {
  if (typeof schema === 'boolean' || schema.const === undefined) {return;}
  
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
