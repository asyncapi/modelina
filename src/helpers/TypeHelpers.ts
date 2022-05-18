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

  /**
   * Returns wether the model is a nullable object (with object and null types)
   * @param model to check
   * @returns {boolean}
   */
  static isNullableObject(model: CommonModel): boolean {
    return Array.isArray(model.type) &&
      model.type.length === 2 &&
      model.type.includes('object') &&
      model.type.includes('null');
  }
}
