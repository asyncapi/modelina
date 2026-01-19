import { Constraints } from '../../helpers';
import { ConstrainedEnumValueModel,ConstrainedEnumModel } from '../../models';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { ScalaOptions, ScalaTypeMapping } from './ScalaGenerator';

function enumFormatToNumberType(
  enumValueModel: ConstrainedEnumValueModel,
  format: string | undefined
): string {
  switch (format) {
    case 'integer':
    case 'int32':
      return 'Int';
    case 'long':
    case 'int64':
      return 'Long';
    case 'float':
      return 'Float';
    case 'double':
      return 'Double';
    default:
      return Number.isInteger(enumValueModel.value) ? 'Int' : 'Double';
  }
}

function fromEnumValueToKotlinType(
  enumValueModel: ConstrainedEnumValueModel,
  format: string | undefined
): string {
  switch (typeof enumValueModel.value) {
    case 'boolean':
      return 'Boolean';
    case 'number':
    case 'bigint':
      return enumFormatToNumberType(enumValueModel, format);
    case 'object':
      return 'Any';
    case 'string':
      return 'String';
    default:
      return 'Any';
  }
}

/**
 * Converts union of different number types to the most strict type it can be.
 *
 * int + double = double (long + double, float + double can never happen, otherwise this would be converted to double)
 * int + float = float (long + float can never happen, otherwise this would be the case as well)
 * int + long = long
 *
 * Basically a copy from JavaConstrainer.ts
 */
function interpretUnionValueType(types: string[]): string {
  if (types.includes('Double')) {
    return 'Double';
  }

  if (types.includes('Float')) {
    return 'Float';
  }

  if (types.includes('Long')) {
    return 'Long';
  }

  return 'Any';
}

export const ScalaDefaultTypeMapping: ScalaTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    if (constrainedModel.ref instanceof ConstrainedEnumModel) {
      return `${constrainedModel.name}.Value`;
    }
    return constrainedModel.name;
  },
  Any(): string {
    return 'Any';
  },
  Float({ constrainedModel }): string {
    return constrainedModel.options.format === 'float' ? 'Float' : 'Double';
  },
  Integer({ constrainedModel }): string {
    return constrainedModel.options.format === 'long' ||
      constrainedModel.options.format === 'int64'
      ? 'Long'
      : 'Int';
  },
  String({ constrainedModel }): string {
    switch (constrainedModel.options.format) {
      case 'date': {
        return 'java.time.LocalDate';
      }
      case 'time': {
        return 'java.time.OffsetTime';
      }
      case 'dateTime':
      case 'date-time': {
        return 'java.time.OffsetDateTime';
      }
      case 'binary': {
        return 'Array[Byte]';
      }
      default: {
        return 'String';
      }
    }
  },
  Boolean(): string {
    return 'Boolean';
  },
  // Since there are not tuples in Kotlin, we have to return a collection of `Any`
  Tuple({ options }): string {
    const isList = options.collectionType && options.collectionType === 'List';

    return isList ? 'List[Any]' : 'Array[Any]';
  },
  Array({ constrainedModel, options }): string {
    const isList = options.collectionType && options.collectionType === 'List';
    const type = constrainedModel.valueModel.type;

    return isList ? `List[${type}]` : `Array[${type}]`;
  },
  Enum({ constrainedModel }): string {
    const valueTypes = constrainedModel.values.map((enumValue) =>
      fromEnumValueToKotlinType(enumValue, constrainedModel.options.format)
    );
    const uniqueTypes = [...new Set(valueTypes)];

    // Enums cannot handle union types, default to a loose type
    return uniqueTypes.length > 1
      ? interpretUnionValueType(uniqueTypes)
      : uniqueTypes[0];
  },
  Union(): string {
    // No Unions in Kotlin, use Any for now.
    return 'Any';
  },
  Dictionary({ constrainedModel }): string {
    return `Map[${constrainedModel.key.type}, ${constrainedModel.value.type}]`;
  }
};

export const ScalaDefaultConstraints: Constraints<ScalaOptions> = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
