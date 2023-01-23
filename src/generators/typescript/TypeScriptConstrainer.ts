import { ConstrainedUnionModel } from '../../models';
import { Logger } from '../../utils';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { TypeScriptTypeMapping } from './TypeScriptGenerator';

export const TypeScriptDefaultTypeMapping: TypeScriptTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Any(): string {
    return 'any';
  },
  Float(): string {
    return 'number';
  },
  Integer(): string {
    return 'number';
  },
  String(): string {
    return 'string';
  },
  Boolean(): string {
    return 'boolean';
  },
  Tuple({ constrainedModel }): string {
    const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
      return constrainedType.value.type;
    });
    return `[${tupleTypes.join(', ')}]`;
  },
  Array({ constrainedModel }): string {
    let arrayType = constrainedModel.valueModel.type;
    if (constrainedModel.valueModel instanceof ConstrainedUnionModel) {
      arrayType = `(${arrayType})`;
    }
    return `${arrayType}[]`;
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union({ constrainedModel }): string {
    const unionTypes = constrainedModel.union.map((unionModel) => {
      return unionModel.type;
    });
    return unionTypes.join(' | ');
  },
  Dictionary({ constrainedModel, options }): string {
    let keyType;
    //There is some restrictions on what can be used as keys for dictionaries.
    if (constrainedModel.key instanceof ConstrainedUnionModel) {
      Logger.error(
        'Key for dictionary is not allowed to be union type, falling back to any model.'
      );
      keyType = 'any';
    } else {
      keyType = constrainedModel.key.type;
    }
    switch (options.mapType) {
      case 'indexedObject':
        return `{ [name: ${keyType}]: ${constrainedModel.value.type} }`;
      case 'record':
        return `Record<${keyType}, ${constrainedModel.value.type}>`;
      default:
      case 'map':
        return `Map<${keyType}, ${constrainedModel.value.type}>`;
    }
  }
};

export const TypeScriptDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
