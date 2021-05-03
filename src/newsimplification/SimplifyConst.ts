
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferTypeFromValue } from './Utils';

/**
 * Process JSON Schema draft 7 enums
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyConst(schema: Schema | boolean, model: CommonModel) {
  if (typeof schema !== 'boolean' && schema.const !== undefined) {
    const schemaConst = schema.const;
    model.enum = [schemaConst];

    //Overwrite existing type 
    const inferredType = inferTypeFromValue(schemaConst);
    if (inferredType !== undefined) {
      model.type = inferredType;
    }
  }
}
