import { TypeMapping } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { PhpDependencyManager } from './PhpDependencyManager';
import { PhpOptions } from './PhpGenerator';

export const PhpDefaultTypeMapping: TypeMapping<
  PhpOptions,
  PhpDependencyManager
> = {
  Object({ constrainedModel }): string {
    //Returning name here because all object models have been split out
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Any(): string {
    return '';
  },
  Float(): string {
    return 'float';
  },
  Integer(): string {
    return 'int';
  },
  String(): string {
    return 'string';
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple(): string {
    return '';
  },
  Array(): string {
    return 'array';
  },
  Enum({ constrainedModel }): string {
    //Returning name here because all enum models have been split out
    return constrainedModel.name;
  },
  Union(): string {
    return '';
  },
  Dictionary(): string {
    return '';
  }
};

export const PhpDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
