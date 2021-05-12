
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
/**
 * Simplifier function for finding the simplified version of properties.
 * 
 * @param schema the schema to simplify properties for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyProperties(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema !== 'boolean' && schema.properties !== undefined) {
    //Ensure object type is inferred
    model.addToTypes('object');

    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      const newModels = simplifier.simplify(propertySchema);
      if (newModels.length > 0) {
        if (model.properties === undefined) model.properties = {};
        const propertyModel = newModels[0];
        //If a simplified property already exist, merge the two
        if (model.properties[`${propertyName}`] !== undefined) {
          model.properties[`${propertyName}`] = CommonModel.mergeCommonModels(model.properties[`${propertyName}`], propertyModel, schema);
        } else {
          model.properties[`${propertyName}`] = propertyModel;
        }
      }
    }
  }
}
