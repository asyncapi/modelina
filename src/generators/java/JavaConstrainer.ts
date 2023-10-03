import { ConstrainedEnumValueModel } from '../../models';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { JavaTypeMapping } from './JavaGenerator';

function enumFormatToNumberType(
  enumValueModel: ConstrainedEnumValueModel,
  format: string
): string {
  switch (format) {
    case 'integer':
    case 'int32':
      return 'int';
    case 'long':
    case 'int64':
      return 'long';
    case 'float':
      return 'float';
    case 'double':
      return 'double';
    default:
      if (Number.isInteger(enumValueModel.value)) {
        return 'int';
      }
      return 'double';
  }
}

const fromEnumValueToType = (
  enumValueModel: ConstrainedEnumValueModel,
  format: string
): string => {
  switch (typeof enumValueModel.value) {
    case 'boolean':
      return 'boolean';
    case 'number':
    case 'bigint':
      return enumFormatToNumberType(enumValueModel, format);
    case 'object':
      return 'Object';
    case 'string':
      return 'String';
    default:
      return 'Object';
  }
};

/**
 * Converts union of different number types to the most strict type it can be.
 *
 * int + double = double (long + double, float + double can never happen, otherwise this would be converted to double)
 * int + float = float (long + float can never happen, otherwise this would be the case as well)
 * int + long = long
 */
const interpretUnionValueType = (types: string[]): string => {
  if (types.includes('double')) {
    return 'double';
  }

  if (types.includes('float')) {
    return 'float';
  }

  if (types.includes('long')) {
    return 'long';
  }

  return 'Object';
};

export const JavaDefaultTypeMapping: JavaTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Any(): string {
    return 'Object';
  },
  Float({ constrainedModel }): string {
    let type = 'Double';
    const format = constrainedModel.originalInput?.['format'];
    if (format === 'float') {
      type = 'float';
    }
    return type;
  },
  Integer({ constrainedModel }): string {
    let type = 'Integer';
    const format = constrainedModel.originalInput?.['format'];
    switch (format) {
      case 'integer':
      case 'int32':
        type = 'int';
        break;
      case 'long':
      case 'int64':
        type = 'long';
        break;
    }
    return type;
  },
  String({ constrainedModel }): string {
    let type = 'String';
    const format = constrainedModel.originalInput?.['format'];
    switch (format) {
      case 'date':
        type = 'java.time.LocalDate';
        break;
      case 'time':
        type = 'java.time.OffsetTime';
        break;
      case 'dateTime':
      case 'date-time':
        type = 'java.time.OffsetDateTime';
        break;
      case 'binary':
        type = 'byte[]';
        break;
    }
    return type;
  },
  Boolean(): string {
    return 'Boolean';
  },
  Tuple({ options }): string {
    //Because Java have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
    const tupleType = 'Object';
    if (options.collectionType && options.collectionType === 'List') {
      return `List<${tupleType}>`;
    }
    return `${tupleType}[]`;
  },
  Array({ constrainedModel, options }): string {
    if (options.collectionType && options.collectionType === 'List') {
      return `List<${constrainedModel.valueModel.type}>`;
    }
    return `${constrainedModel.valueModel.type}[]`;
  },
  Enum({ constrainedModel }): string {
    const format = constrainedModel.originalInput?.['format'];
    const valueTypes = constrainedModel.values.map((enumValue) =>
      fromEnumValueToType(enumValue, format)
    );
    const uniqueTypes = valueTypes.filter((item, pos) => {
      return valueTypes.indexOf(item) === pos;
    });

    //Enums cannot handle union types, default to a loose type
    if (uniqueTypes.length > 1) {
      return interpretUnionValueType(uniqueTypes);
    }
    return uniqueTypes[0];
  },
  Union(): string {
    //Because Java have no notion of unions (and no custom implementation), we have to render it as any value.
    return 'Object';
  },
  Dictionary({ constrainedModel }): string {
    //Limitations to Java is that maps cannot have specific value types...
    if (constrainedModel.value.type === 'int') {
      constrainedModel.value.type = 'Integer';
    }
    return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const JavaDefaultConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};
