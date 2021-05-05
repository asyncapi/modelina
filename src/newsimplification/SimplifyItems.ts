
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
import { addToTypes } from './Utils';

/**
 * Process JSON Schema draft 7 items
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyItems(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema !== 'boolean' && schema.items !== undefined) {
    //Ensure array type is inferred
    addToTypes('array', model);

    if (Array.isArray(schema.items)) {
      model.items = [];
      schema.items.forEach((itemSchema, index) => {
        const itemModels = simplifier.simplify(itemSchema);
        if (itemModels.length > 0) {
          (model.items as CommonModel[])[+index] = itemModels[0];
        }
      });
    } else {
      const itemModels = simplifier.simplify(schema.items);
      if (itemModels.length > 0) {
        model.items = itemModels[0];
      }
    }
  }
}
