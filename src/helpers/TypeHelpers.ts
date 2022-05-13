/* eslint-disable no-unused-vars */
import {CommonModel} from '../models';

export enum ModelKind {
  OBJECT = 'object',
  ARRAY = 'array',
  ENUM = 'enum',
  UNION = 'union',
  NULLABLE = 'nullable',
  PRIMITIVE = 'primitive',
}

export class TypeHelpers {
  /**
   * Returns the type (object | array | union | enum | primitive) of the model
   * @param model to check
   * @returns {ModelKind}
   */
  static extractKind(model: CommonModel): ModelKind {
    if (model.type === 'object') {
      return ModelKind.OBJECT;
    }
    if (model.type === 'array') {
      return ModelKind.ARRAY;
    }
    if (Array.isArray(model.enum)) {
      return ModelKind.ENUM;
    }
    if (Array.isArray(model.type)) {
      if (this.isNullableType(model.type)) {
        return ModelKind.NULLABLE;
      }
      return ModelKind.UNION;
    }
    return ModelKind.PRIMITIVE;
  }

  /**
   * Check if an array of types, is a nullable.
   * Eg. type: ['null','string']
   * @param type
   */
  public static isNullableType(type: string | string[] | undefined): boolean {
    if (type === null || type === undefined || type instanceof String || type.length !== 2) {
      return false;
    }
    const type1IsNull: boolean = type[0] === 'null';
    const type2IsNull: boolean = type[1] === 'null';
    return (type1IsNull && !type2IsNull) || (!type1IsNull && type2IsNull);
  }

  /**
   * Check if an array of types, is a nullable.
   * Eg. type: ['null','string']
   * @param model
   */
  public static isNullable(model: CommonModel | CommonModel[] | undefined): boolean {
    if (model instanceof CommonModel) {
      return this.isNullableType(model.type);
    }
    return false;
  }

  /**
   * Given a nullable array/union, return the primitive type that is allowed to be null.
   * @param type
   */
  public static getNullableType(type: string | string[] | undefined): string {
    if (type === null || type === undefined || type instanceof String || type.length !== 2) {
      throw new Error('Expected type to be a string[] with size 2');
    }
    const type1IsNull: boolean = type[0] === 'null';
    return type1IsNull ? type[1] : type[0];
  }
}
