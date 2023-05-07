import { ConstrainedObjectPropertyModel } from '../../models';
import { TypeMapping } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { CplusplusDependencyManager } from './CplusplusDependencyManager';
import { CplusplusOptions } from './CplusplusGenerator';

function ensureOptional(
  type: string,
  partOfProperty: ConstrainedObjectPropertyModel | undefined,
  dependencyManager: CplusplusDependencyManager
): string {
  if (partOfProperty !== undefined && partOfProperty.required !== true) {
    dependencyManager.addDependency('#include <optional>');
    return `std::optional<${type}>`;
  }
  return type;
}
export const CplusplusDefaultTypeMapping: TypeMapping<
  CplusplusOptions,
  CplusplusDependencyManager
> = {
  Object({
    constrainedModel,
    options,
    partOfProperty,
    dependencyManager
  }): string {
    const type = `${options.namespace}::${constrainedModel.name}`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Reference({
    constrainedModel,
    options,
    partOfProperty,
    dependencyManager
  }): string {
    const type = `${options.namespace}::${constrainedModel.name}`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Any({ partOfProperty, dependencyManager }): string {
    dependencyManager.addDependency('#include <any>');
    const type = 'std::any';
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Float({ partOfProperty, dependencyManager }): string {
    const type = 'double';
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Integer({ partOfProperty, dependencyManager }): string {
    const type = 'int';
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  String({ dependencyManager, partOfProperty }): string {
    dependencyManager.addDependency('#include <string>');
    const type = 'std::string';
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Boolean({ partOfProperty, dependencyManager }): string {
    const type = 'bool';
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Tuple({ constrainedModel, dependencyManager, partOfProperty }): string {
    const types = constrainedModel.tuple.map((model) => {
      return model.value.type;
    });
    dependencyManager.addDependency('#include <tuple>');
    const type = `std::tuple<${types.join(', ')}>`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Array({ constrainedModel, dependencyManager, partOfProperty }): string {
    dependencyManager.addDependency('#include <vector>');
    const type = `std::vector<${constrainedModel.valueModel.type}>`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Enum({
    constrainedModel,
    options,
    partOfProperty,
    dependencyManager
  }): string {
    //Returning name here because all enum models have been split out
    const type = `${options.namespace}::${constrainedModel.name}`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Union({ constrainedModel, dependencyManager, partOfProperty }): string {
    const types = constrainedModel.union.map((model) => {
      return model.type;
    });
    dependencyManager.addDependency('#include <variant>');
    const type = `std::variant<${types.join(', ')}>`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  },
  Dictionary({ constrainedModel, dependencyManager, partOfProperty }): string {
    dependencyManager.addDependency('#include <map>');
    const type = `std::map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
    return ensureOptional(type, partOfProperty, dependencyManager);
  }
};

export const CplusplusDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
