
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
import { isModelObject } from './Utils';

/**
 * Simplifier function for allOf schemas, which can either be merged into existing model or if allowed, create inheritance.
 * 
 * @param schema the schema to simplify allOf for
 * @param model to simplify allOf into
 * @param simplifier the simplifier instance 
 */
export default function simplifyAllOf(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema === 'boolean' || schema.allOf === undefined) return;
  for (const allOfSchema of (schema.allOf)) {  
    const simplifiedModels = simplifier.simplify(allOfSchema);
    if (simplifiedModels.length > 0) {
      const rootSimplifiedModel = simplifiedModels[0];
      if (isModelObject(rootSimplifiedModel) && simplifier.options.allowInheritance === true) {
        if (model.extend === undefined) model.extend = [];
        model.extend.push(`${rootSimplifiedModel.$id}`);
      } else {
        simplifier.combineSchemas(allOfSchema, model, schema);
      }
    }
  }
}
