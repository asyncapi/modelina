import {
  ConstrainedEnumValueModel,
  ConstrainedObjectPropertyModel
} from '../../models';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { CSharpTypeMapping } from './CSharpGenerator';

function getFullTypeDefinition(
  typeName: string,
  partOfProperty: ConstrainedObjectPropertyModel | undefined
) {
  return (partOfProperty?.required ?? true) ? typeName : `${typeName}?`;
}

const fromEnumValueToType = (
  enumValueModel: ConstrainedEnumValueModel
): string => {
  switch (typeof enumValueModel.value) {
    case 'boolean':
      return 'bool';
    case 'number':
    case 'bigint':
      if (Number.isInteger(enumValueModel.value)) {
        return 'int';
      }
      return 'double';
    case 'string':
      return 'string';
    case 'object':
    default:
      return 'dynamic';
  }
};

export const CSharpDefaultTypeMapping: CSharpTypeMapping = {
  Object({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(constrainedModel.name, partOfProperty);
  },
  Reference({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(constrainedModel.name, partOfProperty);
  },
  Any({ partOfProperty }): string {
    return getFullTypeDefinition('dynamic', partOfProperty);
  },
  Float({ partOfProperty }): string {
    return getFullTypeDefinition('double', partOfProperty);
  },
  Integer({ constrainedModel, partOfProperty }): string {
    switch (constrainedModel.options.format) {
      case 'int64':
        return getFullTypeDefinition('long', partOfProperty);
      default:
        return getFullTypeDefinition('int', partOfProperty);
    }
  },
  String({ constrainedModel, partOfProperty }): string {
    switch (constrainedModel.options.format) {
      case 'time':
        return getFullTypeDefinition('System.TimeSpan', partOfProperty);
      case 'date':
        return getFullTypeDefinition('System.DateTime', partOfProperty);
      case 'dateTime':
      case 'date-time':
        return getFullTypeDefinition('System.DateTimeOffset', partOfProperty);
      case 'uuid':
        return getFullTypeDefinition('System.Guid', partOfProperty);
      default:
        return getFullTypeDefinition('string', partOfProperty);
    }
  },
  Boolean({ partOfProperty }): string {
    return getFullTypeDefinition('bool', partOfProperty);
  },
  Tuple({ constrainedModel, partOfProperty }): string {
    const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
      return constrainedType.value.type;
    });
    return getFullTypeDefinition(`(${tupleTypes.join(', ')})`, partOfProperty);
  },
  Array({ constrainedModel, options, partOfProperty }): string {
    const typeString =
      options.collectionType && options.collectionType === 'List'
        ? `IEnumerable<${constrainedModel.valueModel.type}>`
        : `${constrainedModel.valueModel.type}[]`;

    return getFullTypeDefinition(typeString, partOfProperty);
  },
  Enum({ constrainedModel, partOfProperty }): string {
    const typesForValues: Set<string> = new Set();

    for (const value of constrainedModel.values) {
      const typeForValue = fromEnumValueToType(value);
      typesForValues.add(typeForValue);
    }
    // If there exist more then 1 unique type, then default to dynamic
    if (typesForValues.size > 1) {
      return 'dynamic';
    }
    const [typeForValues] = typesForValues;
    return getFullTypeDefinition(typeForValues, partOfProperty);
  },
  Union({ partOfProperty }): string {
    //Because renderPrivateType( CSharp , partOfProperty) have no notion of unions (and no custom implementation), we have to render it as any value.

    return getFullTypeDefinition('dynamic', partOfProperty);
  },
  Dictionary({ constrainedModel, partOfProperty }): string {
    return getFullTypeDefinition(
      `Dictionary<${constrainedModel.key.type}, ${constrainedModel.value.type}>`,
      partOfProperty
    );
  }
};

export const CSharpDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
