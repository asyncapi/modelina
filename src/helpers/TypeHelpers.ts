import { CommonModel } from '../models';
import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel } from '../models/ConstrainedMetaModel';

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

export type TypeContext<T extends ConstrainedMetaModel, Options> = {
  propertyKey?: string,
  options: Options,
  constrainedModel: T,
}

export type TypeMappingFunction<T extends ConstrainedMetaModel, Options> = (context: TypeContext<T, Options>) => string;

export type TypeMapping<Options> = {
  Object: TypeMappingFunction<ConstrainedObjectModel, Options>,
  Reference: TypeMappingFunction<ConstrainedReferenceModel, Options>,
  Any: TypeMappingFunction<ConstrainedAnyModel, Options>,
  Float: TypeMappingFunction<ConstrainedFloatModel, Options>,
  Integer: TypeMappingFunction<ConstrainedIntegerModel, Options>,
  String: TypeMappingFunction<ConstrainedStringModel, Options>,
  Boolean: TypeMappingFunction<ConstrainedBooleanModel, Options>,
  Tuple: TypeMappingFunction<ConstrainedTupleModel, Options>,
  Array: TypeMappingFunction<ConstrainedArrayModel, Options>,
  Enum: TypeMappingFunction<ConstrainedEnumModel, Options>,
  Union: TypeMappingFunction<ConstrainedUnionModel, Options>,
  Dictionary: TypeMappingFunction<ConstrainedDictionaryModel, Options>
};

export function getTypeFromMapping<T extends ConstrainedMetaModel, Options>(typeMapping: TypeMapping<Options>, context: TypeContext<T, Options>): string {
  if (context.constrainedModel instanceof ConstrainedObjectModel) {
    return typeMapping.Object({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedReferenceModel) {
    return typeMapping.Reference({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedAnyModel) {
    return typeMapping.Any(context);
  } else if (context.constrainedModel instanceof ConstrainedFloatModel) {
    return typeMapping.Float(context);
  } else if (context.constrainedModel instanceof ConstrainedIntegerModel) {
    return typeMapping.Integer(context);
  } else if (context.constrainedModel instanceof ConstrainedStringModel) {
    return typeMapping.String(context);
  } else if (context.constrainedModel instanceof ConstrainedBooleanModel) {
    return typeMapping.Boolean(context);
  } else if (context.constrainedModel instanceof ConstrainedTupleModel) {
    return typeMapping.Tuple({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedArrayModel) {
    return typeMapping.Array({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedEnumModel) {
    return typeMapping.Enum({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedUnionModel) {
    return typeMapping.Union({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedDictionaryModel) {
    return typeMapping.Dictionary({...context, constrainedModel: context.constrainedModel});
  }
  throw new Error('Could not find type for model');
}
