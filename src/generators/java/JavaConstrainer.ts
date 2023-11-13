import { Constraints } from '../../helpers';
import {
  ConstrainedEnumValueModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedUnionModel
} from '../../models';
import {
  defaultEnumKeyConstraints,
  defaultEnumValueConstraints
} from './constrainer/EnumConstrainer';
import { defaultModelNameConstraints } from './constrainer/ModelNameConstrainer';
import { defaultPropertyKeyConstraints } from './constrainer/PropertyKeyConstrainer';
import { defaultConstantConstraints } from './constrainer/ConstantConstrainer';
import { JavaTypeMapping } from './JavaGenerator';

function enumFormatToNumberType(
  enumValueModel: ConstrainedEnumValueModel,
  format: string | undefined
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
  format: string | undefined
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

export function unionIncludesBuiltInTypes(
  model: ConstrainedUnionModel
): boolean {
  return !model.union.every(
    (union) =>
      union instanceof ConstrainedObjectModel ||
      (union instanceof ConstrainedReferenceModel &&
        union.ref instanceof ConstrainedObjectModel)
  );
}

function getType({
  constrainedModel,
  partOfProperty,
  typeWhenNullableOrOptional,
  type
}: {
  constrainedModel: ConstrainedMetaModel;
  partOfProperty: ConstrainedObjectPropertyModel | undefined;
  typeWhenNullableOrOptional: string;
  type: string;
}) {
  if (constrainedModel.options.isNullable || !partOfProperty?.required) {
    return typeWhenNullableOrOptional;
  }

  return type;
}

export const JavaDefaultTypeMapping: JavaTypeMapping = {
  Object({ constrainedModel }): string {
    return constrainedModel.name;
  },
  Reference({ constrainedModel }): string {
    if (
      constrainedModel.ref instanceof ConstrainedUnionModel &&
      unionIncludesBuiltInTypes(constrainedModel.ref)
    ) {
      //We only have partial strong typed support for union models
      //Use object if the union includes built-in Java types
      return 'Object';
    }
    return constrainedModel.name;
  },
  Any(): string {
    return 'Object';
  },
  Float({ constrainedModel, partOfProperty }): string {
    switch (constrainedModel.options.format) {
      case 'float':
        return getType({
          constrainedModel,
          partOfProperty,
          typeWhenNullableOrOptional: 'Float',
          type: 'float'
        });
      case 'double':
        return getType({
          constrainedModel,
          partOfProperty,
          typeWhenNullableOrOptional: 'Double',
          type: 'double'
        });
      default:
        return getType({
          constrainedModel,
          partOfProperty,
          typeWhenNullableOrOptional: 'Number',
          type: 'Number'
        });
    }
  },
  Integer({ constrainedModel, partOfProperty }): string {
    const type = getType({
      constrainedModel,
      partOfProperty,
      typeWhenNullableOrOptional: 'Integer',
      type: 'int'
    });
    switch (constrainedModel.options.format) {
      case 'integer':
      case 'int32':
        return type;
      case 'long':
      case 'int64':
        return getType({
          constrainedModel,
          partOfProperty,
          typeWhenNullableOrOptional: 'Long',
          type: 'long'
        });
      default:
        return type;
    }
  },
  String({ constrainedModel }): string {
    switch (constrainedModel.options.format) {
      case 'date':
        return 'java.time.LocalDate';
      case 'time':
        return 'java.time.OffsetTime';
      case 'dateTime':
      case 'date-time':
        return 'java.time.OffsetDateTime';
      case 'binary':
        return 'byte[]';
      default:
        return 'String';
    }
  },
  Boolean({ constrainedModel, partOfProperty }): string {
    return getType({
      constrainedModel,
      partOfProperty,
      typeWhenNullableOrOptional: 'Boolean',
      type: 'boolean'
    });
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
    const valueTypes = constrainedModel.values.map((enumValue) =>
      fromEnumValueToType(enumValue, constrainedModel.options.format)
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
  Union({ constrainedModel }): string {
    if (unionIncludesBuiltInTypes(constrainedModel)) {
      //We only have partial strong typed support for union models
      //Use object if the union includes built-in Java types
      return 'Object';
    }
    return constrainedModel.name;
  },
  Dictionary({ constrainedModel }): string {
    //Limitations to Java is that maps cannot have specific value types...
    if (constrainedModel.value.type === 'int') {
      constrainedModel.value.type = 'Integer';
    }
    return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
  }
};

export const JavaDefaultConstraints: Constraints = {
  enumKey: defaultEnumKeyConstraints(),
  enumValue: defaultEnumValueConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints(),
  constant: defaultConstantConstraints()
};
