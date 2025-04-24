import { AbstractDependencyManager } from '../generators/AbstractDependencyManager';
import {
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedEnumModel,
  ConstrainedObjectPropertyModel,
  ConstrainedAnyModel,
  ConstrainedBooleanModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedUnionModel,
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedTupleModel
} from '../models/ConstrainedMetaModel';
import {
  ObjectModel,
  EnumModel,
  UnionModel,
  MetaModel,
  ObjectPropertyModel
} from '../models/MetaModel';
import { applyTypesAndConst } from './ConstrainedTypes';
import { metaModelFactory } from './MetaModelToConstrained';
import { TypeMapping } from './TypeHelpers';

export type ConstrainContext<
  Options,
  M extends MetaModel,
  DependencyManager extends AbstractDependencyManager
> = {
  partOfProperty?: ConstrainedObjectPropertyModel;
  metaModel: M;
  constrainedName: string;
  options: Options;
  dependencyManager: DependencyManager;
};

export type EnumKeyContext<Options> = {
  enumKey: string;
  constrainedEnumModel: ConstrainedEnumModel;
  enumModel: EnumModel;
  options: Options;
};
export type EnumKeyConstraint<Options> = (
  context: EnumKeyContext<Options>
) => string;

export type EnumValueContext<Options> = {
  enumValue: any;
  constrainedEnumModel: ConstrainedEnumModel;
  enumModel: EnumModel;
  options: Options;
};
export type EnumValueConstraint<Options> = (
  context: EnumValueContext<Options>
) => any;

export type ModelNameContext<Options> = {
  modelName: string;
  options: Options;
};
export type ModelNameConstraint<Options> = (
  context: ModelNameContext<Options>
) => string;

export type PropertyKeyContext<Options> = {
  constrainedObjectPropertyModel: ConstrainedObjectPropertyModel;
  objectPropertyModel: ObjectPropertyModel;
  constrainedObjectModel: ConstrainedObjectModel | ConstrainedUnionModel;
  objectModel: ObjectModel | UnionModel;
  options: Options;
};

export type PropertyKeyConstraint<Options> = (
  context: PropertyKeyContext<Options>
) => string;

export type ConstantContext<Options> = {
  constrainedMetaModel: ConstrainedMetaModel;
  options: Options;
};

export type ConstantConstraint<Options> = (
  context: ConstantContext<Options>
) => unknown;

export interface Constraints<Options> {
  enumKey: EnumKeyConstraint<Options>;
  enumValue: EnumValueConstraint<Options>;
  modelName: ModelNameConstraint<Options>;
  propertyKey: PropertyKeyConstraint<Options>;
  constant: ConstantConstraint<Options>;
}

export function constrainMetaModel<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  typeMapping: TypeMapping<Options, DependencyManager>,
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, MetaModel, DependencyManager>,
  safeTypes: any[] = [
    ConstrainedAnyModel,
    ConstrainedBooleanModel,
    ConstrainedFloatModel,
    ConstrainedIntegerModel,
    ConstrainedStringModel,
    ConstrainedReferenceModel,
    ConstrainedObjectModel,
    ConstrainedEnumModel,
    ConstrainedObjectModel,
    ConstrainedUnionModel,
    ConstrainedArrayModel,
    ConstrainedDictionaryModel,
    ConstrainedTupleModel
  ]
): ConstrainedMetaModel {
  const constrainedModel = metaModelFactory(constrainRules, context, new Map());
  applyTypesAndConst({
    constrainedModel,
    generatorOptions: context.options,
    typeMapping,
    alreadySeenModels: new Map(),
    safeTypes,
    dependencyManager: context.dependencyManager,
    constrainRules
  });
  return constrainedModel;
}
