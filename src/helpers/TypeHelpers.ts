/* eslint-disable no-unused-vars */
import { CommonModel } from '../models';

export enum ModelKind {
  OBJECT = 'object',
  ARRAY = 'array',
  ENUM = 'enum',
  UNION = 'union',
  PRIMITIVE = 'primitive',
}

export class TypeHelpers {
  /**
   * Returns the type (object | array | union | enum | primitive) of the model
   * @param model to check
   * @returns {ModelKind}
   */
  static extractKind(model: CommonModel): ModelKind {
    if (model.type === 'object') {return ModelKind.OBJECT;}
    if (model.type === 'array') {return ModelKind.ARRAY;}
    if (Array.isArray(model.enum)) {return ModelKind.ENUM;}
    if (Array.isArray(model.type)) {return ModelKind.UNION;}
    return ModelKind.PRIMITIVE;
  }
}
