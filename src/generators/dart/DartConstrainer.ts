import { Constraints } from '../../helpers';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { DartTypeMapping } from './DartGenerator';

export const DartDefaultTypeMapping: DartTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Any(): string {
    return 'Object';
  },
  Float(): string {
    return 'double';
  },
  Integer(): string {
    return 'int';
  },
  String({ constrainedModel }): string {
    const format = constrainedModel.originalInput?.format;
    switch (format) {
      case 'date':
        return 'DateTime';
      case 'time':
        return 'DateTime';
      case 'dateTime':
      case 'date-time':
        return 'DateTime';
      case 'string':
      case 'password':
      case 'byte':
        return 'String';
      case 'binary':
        return 'byte[]';
      default:
        return 'String';
    }
  },
  Boolean(): string {
    return 'bool';
  },
  Tuple({ options }): string {
    //Since Dart dont support tuples, lets use the most generic type
    if (options.collectionType && options.collectionType === 'List') {
      return 'List<Object>';
    }
    return 'Object[]';
  },
  Array({ constrainedModel, options }): string {
    if (options.collectionType && options.collectionType === 'List') {
      return `List<${constrainedModel.valueModel.type}>`;
    }
    return `${constrainedModel.valueModel.type}[]`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union(): string {
    return 'Object';
  },
  Dictionary({ constrainedModel }): string {
    return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const DartDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
