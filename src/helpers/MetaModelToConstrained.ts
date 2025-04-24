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
  ConstrainedEnumValueModel,
  ConstrainedObjectPropertyModel,
  ConstrainedMetaModelOptions,
  ConstrainedTupleValueModel
} from '../models/ConstrainedMetaModel';
import {
  AnyModel,
  BooleanModel,
  FloatModel,
  IntegerModel,
  ObjectModel,
  ReferenceModel,
  StringModel,
  TupleModel,
  ArrayModel,
  UnionModel,
  EnumModel,
  DictionaryModel,
  MetaModel,
  ObjectPropertyModel,
  EnumValueModel
} from '../models/MetaModel';

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

const placeHolderConstrainedObject = new ConstrainedAnyModel(
  '',
  undefined,
  {},
  ''
);

function getConstrainedMetaModelOptions(
  metaModel: MetaModel
): ConstrainedMetaModelOptions {
  const options: ConstrainedMetaModelOptions = {};

  options.const = metaModel.options.const;
  options.isNullable = metaModel.options.isNullable;
  options.discriminator = metaModel.options.discriminator;
  options.format = metaModel.options.format;
  options.isExtended = metaModel.options.isExtended;

  return options;
}

function referenceModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, ReferenceModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedReferenceModel {
  const constrainedModel = new ConstrainedReferenceModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    placeHolderConstrainedObject
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);

  const constrainedRefModel = metaModelFactory(
    constrainRules,
    { ...context, metaModel: context.metaModel.ref, partOfProperty: undefined },
    alreadySeenModels
  );
  constrainedModel.ref = constrainedRefModel;

  return constrainedModel;
}
function anyModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  context: ConstrainContext<Options, AnyModel, DependencyManager>
): ConstrainedAnyModel {
  return new ConstrainedAnyModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    ''
  );
}
function floatModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  context: ConstrainContext<Options, FloatModel, DependencyManager>
): ConstrainedFloatModel {
  return new ConstrainedFloatModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    ''
  );
}
function integerModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  context: ConstrainContext<Options, IntegerModel, DependencyManager>
): ConstrainedIntegerModel {
  return new ConstrainedIntegerModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    ''
  );
}
function stringModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  context: ConstrainContext<Options, StringModel, DependencyManager>
): ConstrainedStringModel {
  return new ConstrainedStringModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    ''
  );
}
function booleanModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  context: ConstrainContext<Options, BooleanModel, DependencyManager>
): ConstrainedBooleanModel {
  return new ConstrainedBooleanModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    ''
  );
}
function tupleModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, TupleModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedTupleModel {
  const constrainedModel = new ConstrainedTupleModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    []
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);

  const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
    const tupleType = metaModelFactory(
      constrainRules,
      { ...context, metaModel: tupleValue.value, partOfProperty: undefined },
      alreadySeenModels
    );
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  constrainedModel.tuple = constrainedTupleModels;

  return constrainedModel;
}
function arrayModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, ArrayModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedArrayModel {
  const constrainedModel = new ConstrainedArrayModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    placeHolderConstrainedObject
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);
  const constrainedValueModel = metaModelFactory(
    constrainRules,
    {
      ...context,
      metaModel: context.metaModel.valueModel,
      partOfProperty: undefined
    },
    alreadySeenModels
  );
  constrainedModel.valueModel = constrainedValueModel;

  return constrainedModel;
}

function unionModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, UnionModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedUnionModel {
  const constrainedModel = new ConstrainedUnionModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    [],
    {}
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);

  const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
    return metaModelFactory(
      constrainRules,
      { ...context, metaModel: unionValue, partOfProperty: undefined },
      alreadySeenModels
    );
  });
  constrainedModel.union = constrainedUnionModels;

  for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
    const constrainedPropertyModel = createConstrainedPropertyModel(
      propertyMetaModel,
      constrainedModel,
      constrainRules,
      context,
      alreadySeenModels
    );
    constrainedModel.properties[String(constrainedPropertyModel.propertyName)] =
      constrainedPropertyModel;
  }

  return constrainedModel;
}
function dictionaryModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, DictionaryModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedDictionaryModel {
  const constrainedModel = new ConstrainedDictionaryModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    placeHolderConstrainedObject,
    placeHolderConstrainedObject,
    context.metaModel.serializationType
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);

  const keyModel = metaModelFactory(
    constrainRules,
    { ...context, metaModel: context.metaModel.key, partOfProperty: undefined },
    alreadySeenModels
  );
  constrainedModel.key = keyModel;
  const valueModel = metaModelFactory(
    constrainRules,
    {
      ...context,
      metaModel: context.metaModel.value,
      partOfProperty: undefined
    },
    alreadySeenModels
  );
  constrainedModel.value = valueModel;

  return constrainedModel;
}

function objectModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, ObjectModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedObjectModel {
  const options = getConstrainedMetaModelOptions(context.metaModel);

  if (context.metaModel.options.extend?.length) {
    options.extend = [];

    for (const extend of context.metaModel.options.extend) {
      options.extend.push(
        metaModelFactory(
          constrainRules,
          {
            ...context,
            metaModel: extend,
            partOfProperty: undefined
          },
          alreadySeenModels
        )
      );
    }
  }

  const constrainedModel = new ConstrainedObjectModel(
    context.constrainedName,
    context.metaModel.originalInput,
    options,
    '',
    {}
  );
  alreadySeenModels.set(context.metaModel, constrainedModel);

  for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
    const constrainedPropertyModel = createConstrainedPropertyModel(
      propertyMetaModel,
      constrainedModel,
      constrainRules,
      context,
      alreadySeenModels
    );
    constrainedModel.properties[String(constrainedPropertyModel.propertyName)] =
      constrainedPropertyModel;
  }

  return constrainedModel;
}

function createConstrainedPropertyModel<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  propertyMetaModel: ObjectPropertyModel,
  constrainedModel: ConstrainedObjectModel | ConstrainedUnionModel,
  constrainRules: Constraints<Options>,
  context: ConstrainContext<
    Options,
    ObjectModel | UnionModel,
    DependencyManager
  >,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>
): ConstrainedObjectPropertyModel {
  const constrainedPropertyModel = new ConstrainedObjectPropertyModel(
    '',
    propertyMetaModel.propertyName,
    propertyMetaModel.required,
    constrainedModel
  );
  const constrainedPropertyName = constrainRules.propertyKey({
    objectPropertyModel: propertyMetaModel,
    constrainedObjectPropertyModel: constrainedPropertyModel,
    constrainedObjectModel: constrainedModel,
    objectModel: context.metaModel,
    options: context.options
  });
  constrainedPropertyModel.propertyName = constrainedPropertyName;
  const constrainedProperty = metaModelFactory(
    constrainRules,
    {
      ...context,
      metaModel: propertyMetaModel.property,
      partOfProperty: constrainedPropertyModel
    },
    alreadySeenModels
  );
  constrainedPropertyModel.property = constrainedProperty;

  return constrainedPropertyModel;
}

function enumModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, EnumModel, DependencyManager>
): ConstrainedEnumModel {
  const constrainedModel = new ConstrainedEnumModel(
    context.constrainedName,
    context.metaModel.originalInput,
    getConstrainedMetaModelOptions(context.metaModel),
    '',
    []
  );

  const enumValueToConstrainedEnumValueModel = (
    enumValue: EnumValueModel
  ): ConstrainedEnumValueModel => {
    const constrainedEnumKey = constrainRules.enumKey({
      enumKey: String(enumValue.key),
      enumModel: context.metaModel,
      constrainedEnumModel: constrainedModel,
      options: context.options
    });
    const constrainedEnumValue = constrainRules.enumValue({
      enumValue: enumValue.value,
      enumModel: context.metaModel,
      constrainedEnumModel: constrainedModel,
      options: context.options
    });
    return new ConstrainedEnumValueModel(
      constrainedEnumKey,
      constrainedEnumValue,
      enumValue.value
    );
  };

  for (const enumValue of context.metaModel.values) {
    constrainedModel.values.push(
      enumValueToConstrainedEnumValueModel(enumValue)
    );
  }

  return constrainedModel;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function metaModelFactory<
  Options,
  DependencyManager extends AbstractDependencyManager
>(
  constrainRules: Constraints<Options>,
  context: ConstrainContext<Options, MetaModel, DependencyManager>,
  alreadySeenModels: Map<MetaModel, ConstrainedMetaModel> = new Map()
): ConstrainedMetaModel {
  if (alreadySeenModels.has(context.metaModel)) {
    return alreadySeenModels.get(context.metaModel) as ConstrainedMetaModel;
  }
  const constrainedName = constrainRules.modelName({
    modelName: context.metaModel.name,
    options: context.options
  });
  const newContext = { ...context, constrainedName };

  if (newContext.metaModel instanceof ObjectModel) {
    return objectModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  } else if (newContext.metaModel instanceof ReferenceModel) {
    return referenceModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  } else if (newContext.metaModel instanceof DictionaryModel) {
    return dictionaryModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  } else if (newContext.metaModel instanceof TupleModel) {
    return tupleModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  } else if (newContext.metaModel instanceof ArrayModel) {
    return arrayModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  } else if (newContext.metaModel instanceof UnionModel) {
    return unionModelFactory(
      constrainRules,
      { ...newContext, metaModel: newContext.metaModel },
      alreadySeenModels
    );
  }
  // Simple models are those who does not have properties that can contain other MetaModels.
  let simpleModel: ConstrainedMetaModel | undefined;
  if (newContext.metaModel instanceof EnumModel) {
    simpleModel = enumModelFactory(constrainRules, {
      ...newContext,
      metaModel: newContext.metaModel
    });
  } else if (newContext.metaModel instanceof BooleanModel) {
    simpleModel = booleanModelFactory({
      ...newContext,
      metaModel: newContext.metaModel
    });
  } else if (newContext.metaModel instanceof AnyModel) {
    simpleModel = anyModelFactory({
      ...newContext,
      metaModel: newContext.metaModel
    });
  } else if (newContext.metaModel instanceof FloatModel) {
    simpleModel = floatModelFactory({
      ...newContext,
      metaModel: newContext.metaModel
    });
  } else if (newContext.metaModel instanceof IntegerModel) {
    simpleModel = integerModelFactory({
      ...newContext,
      metaModel: newContext.metaModel
    });
  } else if (newContext.metaModel instanceof StringModel) {
    simpleModel = stringModelFactory({
      ...newContext,
      metaModel: newContext.metaModel
    });
  }
  if (simpleModel !== undefined) {
    alreadySeenModels.set(context.metaModel, simpleModel);
    return simpleModel;
  }

  throw new Error('Could not constrain model');
}
