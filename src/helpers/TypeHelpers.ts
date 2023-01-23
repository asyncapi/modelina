import { AbstractDependencyManager } from '../generators/AbstractDependencyManager';
import {
  ConstrainedAnyModel,
  ConstrainedBooleanModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedArrayModel,
  ConstrainedUnionModel,
  ConstrainedEnumModel,
  ConstrainedDictionaryModel,
  ConstrainedObjectPropertyModel
} from '../models/ConstrainedMetaModel';

export type TypeContext<
  T extends ConstrainedMetaModel,
  Options,
  DependencyManager extends AbstractDependencyManager
> = {
  /**
   * If the model is a property in an object model this can be used to conditionally change types based on property information.
   */
  partOfProperty?: ConstrainedObjectPropertyModel;
  /**
   * The underlying options provided to the generator
   */
  options: Options;
  /**
   * The specific constrained model that we are trying to find the type for
   */
  constrainedModel: T;
  /**
   * Dependency manager that can be used to add custom dependencies to the rendering of the model, such as when using external types.
   */
  dependencyManager: DependencyManager;
};

export type TypeMappingFunction<
  T extends ConstrainedMetaModel,
  Options,
  DependencyManager extends AbstractDependencyManager
> = (context: TypeContext<T, Options, DependencyManager>) => string;

export type TypeMapping<
  Options,
  DependencyManager extends AbstractDependencyManager
> = {
  Object: TypeMappingFunction<
    ConstrainedObjectModel,
    Options,
    DependencyManager
  >;
  Reference: TypeMappingFunction<
    ConstrainedReferenceModel,
    Options,
    DependencyManager
  >;
  Any: TypeMappingFunction<ConstrainedAnyModel, Options, DependencyManager>;
  Float: TypeMappingFunction<ConstrainedFloatModel, Options, DependencyManager>;
  Integer: TypeMappingFunction<
    ConstrainedIntegerModel,
    Options,
    DependencyManager
  >;
  String: TypeMappingFunction<
    ConstrainedStringModel,
    Options,
    DependencyManager
  >;
  Boolean: TypeMappingFunction<
    ConstrainedBooleanModel,
    Options,
    DependencyManager
  >;
  Tuple: TypeMappingFunction<ConstrainedTupleModel, Options, DependencyManager>;
  Array: TypeMappingFunction<ConstrainedArrayModel, Options, DependencyManager>;
  Enum: TypeMappingFunction<ConstrainedEnumModel, Options, DependencyManager>;
  Union: TypeMappingFunction<ConstrainedUnionModel, Options, DependencyManager>;
  Dictionary: TypeMappingFunction<
    ConstrainedDictionaryModel,
    Options,
    DependencyManager
  >;
};

export function getTypeFromMapping<
  T extends ConstrainedMetaModel,
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  typeMapping: TypeMapping<Options, DependencyManager>,
  context: TypeContext<T, Options, DependencyManager>
): string {
  if (context.constrainedModel instanceof ConstrainedObjectModel) {
    return typeMapping.Object({
      ...context,
      constrainedModel: context.constrainedModel
    });
  } else if (context.constrainedModel instanceof ConstrainedReferenceModel) {
    return typeMapping.Reference({
      ...context,
      constrainedModel: context.constrainedModel
    });
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
    return typeMapping.Tuple({
      ...context,
      constrainedModel: context.constrainedModel
    });
  } else if (context.constrainedModel instanceof ConstrainedArrayModel) {
    return typeMapping.Array({
      ...context,
      constrainedModel: context.constrainedModel
    });
  } else if (context.constrainedModel instanceof ConstrainedEnumModel) {
    return typeMapping.Enum({
      ...context,
      constrainedModel: context.constrainedModel
    });
  } else if (context.constrainedModel instanceof ConstrainedUnionModel) {
    return typeMapping.Union({
      ...context,
      constrainedModel: context.constrainedModel
    });
  } else if (context.constrainedModel instanceof ConstrainedDictionaryModel) {
    return typeMapping.Dictionary({
      ...context,
      constrainedModel: context.constrainedModel
    });
  }
  throw new Error('Could not find type for model');
}
