import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { GoTypeMapping } from './GoGenerator';

export const GoDefaultTypeMapping: GoTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return `${constrainedModel.name}`;
  },
  Any(): string {
    return 'interface{}';
  },
  Float(): string {
    return 'float64';
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
    //Because Go have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
    return '[]interface{}';
  },
  Array({ constrainedModel }): string {
    return `[]${constrainedModel.valueModel.type}`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union({constrainedModel}): string {
    //Because Go have no notion of unions (and no custom implementation), we have to render it as any value.
    return `${constrainedModel.name}`;
  },
  Dictionary({ constrainedModel }): string {
    return `map[${constrainedModel.key.type}]${constrainedModel.value.type}`;
  }
};

export const GoDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
