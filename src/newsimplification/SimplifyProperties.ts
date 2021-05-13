import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';

/**
 * Simplifier function for finding the simplified version of properties for a model.
 * 
 * @param schema the schema to simplify properties for
 * @param model the model to simplify properties into
 * @param simplifier the simplifier instance 
 */
export default function simplifyProperties(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema !== 'boolean' && schema.properties !== undefined) {
    model.addTypes('object');

    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      const propertyModels = simplifier.simplify(propertySchema);
      if (propertyModels.length > 0) {
        model.addProperty(propertyName, propertyModels[0], schema);
      }
    }
  }
}

