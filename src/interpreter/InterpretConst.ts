
import { Draft4Schema } from '../models/Draft4Schema';
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
  //Draft 4 does not include const keyword
  if (schema instanceof Draft4Schema || typeof schema === 'boolean' || schema.const === undefined) {return;}
  
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
