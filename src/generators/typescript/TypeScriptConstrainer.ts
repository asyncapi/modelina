import { ConstrainedMetaModel, ConstrainedUnionModel } from '../../models';
import { Logger } from '../../utils';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { TypeScriptTypeMapping } from './TypeScriptGenerator';
import { Constraints } from '../../helpers';
function applyNullable(model: ConstrainedMetaModel, type: string) {
  if (model.options.isNullable) {
    return `${type} | null`;
  }
  return type;
}
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
  Float({ constrainedModel }): string {
    return applyNullable(constrainedModel, 'number');
  },
  Integer({ constrainedModel }): string {
    return applyNullable(constrainedModel, 'number');
  },
  String({ constrainedModel }): string {
    return applyNullable(constrainedModel, 'string');
  },
  Boolean({ constrainedModel }): string {
    return applyNullable(constrainedModel, 'boolean');
  },
  Tuple({ constrainedModel }): string {
    const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
      return constrainedType.value.type;
    });
    const tupleType = `[${tupleTypes.join(', ')}]`;
    return applyNullable(constrainedModel, tupleType);
  },
  Array({ constrainedModel }): string {
    let arrayType = constrainedModel.valueModel.type;
    if (constrainedModel.valueModel instanceof ConstrainedUnionModel) {
      arrayType = `(${arrayType})`;
    }
    arrayType = `${arrayType}[]`;
    return applyNullable(constrainedModel, arrayType);
  },
  Enum({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Union(args): string {
    const unionTypes = args.constrainedModel.union.map((unionModel) => {
      if (unionModel.options.const?.value) {
        return `${unionModel.options.const.value}`;
      }

      return unionModel.type;
    });
    return applyNullable(args.constrainedModel, unionTypes.join(' | '));
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
    let dictionaryType;
    switch (options.mapType) {
      case 'indexedObject':
        dictionaryType = `{ [name: ${keyType}]: ${constrainedModel.value.type} }`;
        break;
      case 'record':
        dictionaryType = `Record<${keyType}, ${constrainedModel.value.type}>`;
        break;
      case 'map':
        dictionaryType = `Map<${keyType}, ${constrainedModel.value.type}>`;
        break;
    }
    return applyNullable(constrainedModel, dictionaryType);
  }
};

export const TypeScriptDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
