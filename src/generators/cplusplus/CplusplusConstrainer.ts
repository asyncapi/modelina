import { TypeMapping } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { CplusplusDependencyManager } from './CplusplusDependencyManager';
import { CplusplusOptions } from './CplusplusGenerator';

export const CplusplusDefaultTypeMapping: TypeMapping<
  CplusplusOptions,
  CplusplusDependencyManager
> = {
  Object({ constrainedModel }): string {
    //Returning name here because all object models have been split out
    return `${constrainedModel.name}`;
  },
  Reference({ constrainedModel }): string {
    return `${constrainedModel.name}*`;
  },
  Any({ dependencyManager }): string {
    dependencyManager.addDependency('#include <utility>');
    return 'std::any';
  },
  Float(): string {
    return 'double';
  },
  Integer(): string {
    return 'int';
  },
  String({ dependencyManager }): string {
    dependencyManager.addDependency('#include <string>');
    return 'std::string';
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple({ constrainedModel, dependencyManager }): string {
    const types = constrainedModel.tuple.map((model) => {
      return model.value.type;
    });
    dependencyManager.addDependency('#include <tuple>');
    return `std::tuple<${types.join(', ')}>`;
  },
  Array({ constrainedModel, dependencyManager }): string {
    dependencyManager.addDependency('#include <vector>');
    return `std::vector<${constrainedModel.valueModel.type}>`;
  },
  Enum({ constrainedModel }): string {
    //Returning name here because all enum models have been split out
    return `${constrainedModel.name}`;
  },
  Union({ constrainedModel, dependencyManager }): string {
    const types = constrainedModel.union.map((model) => {
      return model.type;
    });
    dependencyManager.addDependency('#include <variant>');
    return `std::variant<${types.join(', ')}>`;
  },
  Dictionary({ constrainedModel, dependencyManager }): string {
    dependencyManager.addDependency('#include <map>');
    return `std::map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const CplusplusDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
