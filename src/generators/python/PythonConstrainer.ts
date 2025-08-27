import { Constraints } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { PythonOptions, PythonTypeMapping } from './PythonGenerator';
import { PYTHON_PYDANTIC_PRESET } from './presets';
import {
  ConstrainedObjectModel,
  ConstrainedReferenceModel
} from '../../models';

export const PythonDefaultTypeMapping: PythonTypeMapping = {
  Object({ constrainedModel }): string {
    //Returning name here because all object models have been split out
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Any({ dependencyManager }): string {
    dependencyManager.addDependency('from typing import Any');
    return 'Any';
  },
  Float(): string {
    return 'float';
  },
  Integer(): string {
    return 'int';
  },
  String(): string {
    return 'str';
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple({ constrainedModel }): string {
    const tupleTypes = constrainedModel.tuple.map((unionModel) => {
      return unionModel.value.type;
    });
    return `tuple[${tupleTypes.join(', ')}]`;
  },
  Array({ constrainedModel, dependencyManager }): string {
    dependencyManager.addDependency('from typing import List');
    return `List[${constrainedModel.valueModel.type}]`;
  },
  Enum({ constrainedModel }): string {
    //Returning name here because all enum models have been split out
    return constrainedModel.name;
  },
  Union({ constrainedModel, options, dependencyManager }): string {
    dependencyManager.addDependency('from typing import Union');
    const unionTypes = constrainedModel.union.map((unionModel) => {
      return unionModel.type;
    });
    const uniqueSet = new Set(unionTypes);
    // support Python pre 3.10
    let union = `Union[${[...uniqueSet].join(', ')}]`;

    if (
      constrainedModel.options.discriminator &&
      options.presets?.includes(PYTHON_PYDANTIC_PRESET)
    ) {
      const discriminator =
        constrainedModel.options.discriminator.discriminator;
      const reference = constrainedModel.union[0];
      if (reference instanceof ConstrainedReferenceModel) {
        const ref = reference.ref;
        if (ref instanceof ConstrainedObjectModel) {
          const properties = ref.properties;
          const property = Object.values(properties).find((property) => {
            return property.unconstrainedPropertyName === discriminator;
          });
          if (property !== undefined) {
            dependencyManager.addDependency('from typing import Annotated');
            union = `Annotated[${union}, Field(discriminator='${property.propertyName}')]`;
          }
        }
      }
    }

    return union;
  },
  Dictionary({ constrainedModel }): string {
    return `dict[${constrainedModel.key.type}, ${constrainedModel.value.type}]`;
  }
};

export const PythonDefaultConstraints: Constraints<PythonOptions> = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
