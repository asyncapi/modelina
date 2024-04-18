import { AbstractDependencyManager } from '../generators/AbstractDependencyManager';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../models/ConstrainedMetaModel';
import { Constraints } from './MetaModelToConstrained';

import { TypeMapping, getTypeFromMapping } from './TypeHelpers';

export interface ApplyingTypesOptions<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
> {
  /**
   * Constrained Model types that are safe to constrain the type for.
   * This varies per language as they are split out differently from each other.
   *
   * A safe type, means that it does not depend on other meta models to determine it's type.
   */
  safeTypes: any[];
  constrainedModel: ConstrainedMetaModel;
  typeMapping: TypeMapping<GeneratorOptions, DependencyManager>;
  alreadySeenModels: Map<ConstrainedMetaModel, string | undefined>;
  generatorOptions: GeneratorOptions;
  partOfProperty?: ConstrainedObjectPropertyModel;
  dependencyManager: DependencyManager;
  shouldWalkNode?: boolean;
  constrainRules: Constraints<GeneratorOptions>;
}

/**
 * Applying types through cyclic analysis (https://en.wikipedia.org/wiki/Cycle_(graph_theory))
 * to detect and adapt unmanageable models that are cyclic where needed.
 *
 * For example;
 *  Model a: Union model with Model b
 *  Model b: Union model with Model a
 * In such case we are unable to render the type, cause
 */
export function applyTypes<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(
  context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>
): ConstrainedMetaModel | undefined {
  const {
    constrainedModel,
    safeTypes,
    typeMapping,
    partOfProperty,
    dependencyManager,
    generatorOptions,
    alreadySeenModels,
    shouldWalkNode = true,
    constrainRules
  } = context;
  const isCyclicModel =
    alreadySeenModels.has(constrainedModel) &&
    alreadySeenModels.get(constrainedModel) === undefined;
  const hasBeenSolved = alreadySeenModels.has(constrainedModel);

  if (isCyclicModel) {
    //Cyclic models detected, having to make the edge (right before cyclic occur) to use any meta model (most open type)
    //With the same information as the node we walk to
    const anyModel = new ConstrainedAnyModel(
      constrainedModel.name,
      constrainedModel.originalInput,
      constrainedModel.options,
      ''
    );
    anyModel.type = getTypeFromMapping(typeMapping, {
      constrainedModel: anyModel,
      options: generatorOptions,
      partOfProperty,
      dependencyManager
    });

    if (anyModel.options.const) {
      const constrainedConstant = constrainRules.constant({
        constrainedMetaModel: anyModel,
        options: generatorOptions
      });
      anyModel.options.const.value = constrainedConstant;
    }

    alreadySeenModels.set(anyModel, anyModel.type);
    return anyModel;
  } else if (hasBeenSolved) {
    return undefined;
  }

  //Mark the model as having been walked but does not have a type yet
  alreadySeenModels.set(constrainedModel, undefined);

  //Walk over all safe models that can determine it's type right away
  for (const safeType of safeTypes) {
    if (constrainedModel instanceof safeType) {
      constrainedModel.type = getTypeFromMapping(typeMapping, {
        constrainedModel,
        options: generatorOptions,
        partOfProperty,
        dependencyManager
      });

      if (constrainedModel.options.const) {
        const constrainedConstant = constrainRules.constant({
          constrainedMetaModel: constrainedModel,
          options: generatorOptions
        });
        constrainedModel.options.const.value = constrainedConstant;
      }
      alreadySeenModels.set(constrainedModel, constrainedModel.type);
      break;
    }
  }
  if (shouldWalkNode) {
    walkNode(context);
  }
}

/**
 * A node is a model that can contain other models and is not a safe type to constrain i.e. a meta model that is not split out.
 */
function walkNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const { constrainedModel, constrainRules, generatorOptions } = context;

  if (constrainedModel instanceof ConstrainedObjectModel) {
    walkObjectNode(context);
  } else if (constrainedModel instanceof ConstrainedDictionaryModel) {
    walkDictionaryNode(context);
  } else if (constrainedModel instanceof ConstrainedTupleModel) {
    walkTupleNode(context);
  } else if (constrainedModel instanceof ConstrainedArrayModel) {
    walkArrayNode(context);
  } else if (constrainedModel instanceof ConstrainedUnionModel) {
    walkUnionNode(context);
  } else if (constrainedModel instanceof ConstrainedReferenceModel) {
    walkReferenceNode(context);
  }
  if (constrainedModel.type === '') {
    constrainedModel.type = getTypeFromMapping(context.typeMapping, {
      constrainedModel,
      options: context.generatorOptions,
      partOfProperty: context.partOfProperty,
      dependencyManager: context.dependencyManager
    });
    context.alreadySeenModels.set(constrainedModel, constrainedModel.type);
  }

  if (constrainedModel instanceof ConstrainedReferenceModel) {
    if (constrainedModel.options.const) {
      const constrainedConstant = constrainRules.constant({
        constrainedMetaModel: constrainedModel,
        options: generatorOptions
      });
      constrainedModel.options.const.value = constrainedConstant;
    }
  }

  if (constrainedModel instanceof ConstrainedUnionModel) {
    addDiscriminatorTypeToUnionModel(constrainedModel);
  }

}

function walkObjectNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const objectModel = context.constrainedModel as ConstrainedObjectModel;

  for (const [propertyKey, propertyModel] of Object.entries({
    ...objectModel.properties
  })) {
    const overWriteModel = applyTypes({
      ...context,
      constrainedModel: propertyModel.property,
      partOfProperty: propertyModel
    });
    if (overWriteModel) {
      // eslint-disable-next-line security/detect-object-injection
      objectModel.properties[propertyKey].property = overWriteModel;
    }
  }
}

function walkDictionaryNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const dictionaryModel =
    context.constrainedModel as ConstrainedDictionaryModel;

  const overwriteKeyModel = applyTypes({
    ...context,
    constrainedModel: dictionaryModel.key,
    partOfProperty: undefined
  });
  if (overwriteKeyModel) {
    dictionaryModel.key = overwriteKeyModel;
  }
  const overWriteValueModel = applyTypes({
    ...context,
    constrainedModel: dictionaryModel.value,
    partOfProperty: undefined
  });
  if (overWriteValueModel) {
    dictionaryModel.value = overWriteValueModel;
  }
}
function walkTupleNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const tupleModel = context.constrainedModel as ConstrainedTupleModel;

  for (const [index, tupleMetaModel] of [...tupleModel.tuple].entries()) {
    const overwriteTupleModel = applyTypes({
      ...context,
      constrainedModel: tupleMetaModel.value,
      partOfProperty: undefined
    });
    if (overwriteTupleModel) {
      // eslint-disable-next-line security/detect-object-injection
      tupleModel.tuple[index].value = overwriteTupleModel;
    }
  }
}

function walkArrayNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const arrayModel = context.constrainedModel as ConstrainedArrayModel;
  const overWriteArrayModel = applyTypes({
    ...context,
    constrainedModel: arrayModel.valueModel,
    partOfProperty: undefined,
    shouldWalkNode: true
  });

  if (overWriteArrayModel) {
    arrayModel.valueModel = overWriteArrayModel;
  }
}

function walkUnionNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const unionModel = context.constrainedModel as ConstrainedUnionModel;
  //If all union value models have type, we can go ahead and get the type for the union as well.
  for (const [index, unionValueModel] of [...unionModel.union].entries()) {
    const overwriteUnionModel = applyTypes({
      ...context,
      constrainedModel: unionValueModel,
      partOfProperty: undefined,
      shouldWalkNode: true
    });

    if (overwriteUnionModel) {
      // eslint-disable-next-line security/detect-object-injection
      unionModel.union[index] = overwriteUnionModel;
    }
  }
}

function walkReferenceNode<
  GeneratorOptions,
  DependencyManager extends AbstractDependencyManager
>(context: ApplyingTypesOptions<GeneratorOptions, DependencyManager>) {
  const referenceModel = context.constrainedModel as ConstrainedReferenceModel;
  const overwriteReference = applyTypes({
    ...context,
    constrainedModel: referenceModel.ref,
    partOfProperty: undefined
  });

  if (overwriteReference) {
    referenceModel.ref = overwriteReference;
  }
}

function addDiscriminatorTypeToUnionModel(
  constrainedModel: ConstrainedUnionModel
) {
  if (!constrainedModel.options.discriminator) {
    return;
  }

  const propertyTypes = new Set();

  for (const union of constrainedModel.union) {
    if (union instanceof ConstrainedReferenceModel) {
      const ref = union.ref;

      if (ref instanceof ConstrainedObjectModel) {
        const discriminatorProp = Object.values(ref.properties).find(
          (model) =>
            model.unconstrainedPropertyName ===
            constrainedModel.options.discriminator?.discriminator
        );

        if (discriminatorProp) {
          propertyTypes.add(discriminatorProp.property.type);
        }
      }
    }
  }

  if (propertyTypes.size === 1) {
    constrainedModel.options.discriminator.type = propertyTypes
      .keys()
      .next().value;
  }
}