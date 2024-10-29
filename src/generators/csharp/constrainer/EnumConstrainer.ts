import { ConstrainedEnumModel, EnumModel } from '../../../models';
import {
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NO_RESERVED_KEYWORDS
} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedCSharpKeyword } from '../Constants';
import {
  CSharpEnumKeyConstraint,
  CSharpEnumValueConstraint
} from '../CSharpGenerator';

export type ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_DUPLICATE_KEYS: (
    constrainedEnumModel: ConstrainedEnumModel,
    enumModel: EnumModel,
    value: string,
    namingFormatter: (value: string) => string
  ) => string;
  NO_EMPTY_VALUE: (value: string) => string;
  NAMING_FORMATTER: (value: string) => string;
  NO_RESERVED_KEYWORDS: (value: string) => string;
};

export const DefaultEnumKeyConstraints: ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => {
    //Exclude '_', '$' because they are allowed as enum keys
    return FormatHelpers.replaceSpecialCharacters(value, {
      exclude: ['_', '$'],
      separator: '_'
    });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_KEYS: NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toConstantCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, (value) => {
      // We don't care about comparing values in lowercase as we are using constant case
      // This means the reserved keywords technically never clashes
      return isReservedCSharpKeyword(value, false);
    });
  }
};

export function defaultEnumKeyConstraints(
  customConstraints?: Partial<ModelEnumKeyConstraints>
): CSharpEnumKeyConstraint {
  const constraints = { ...DefaultEnumKeyConstraints, ...customConstraints };

  return ({ enumKey, enumModel, constrainedEnumModel }) => {
    let constrainedEnumKey = enumKey;
    constrainedEnumKey = constraints.NO_SPECIAL_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_NUMBER_START_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_EMPTY_VALUE(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS(constrainedEnumKey);
    //If the enum key has been manipulated, lets make sure it don't clash with existing keys
    if (constrainedEnumKey !== enumKey) {
      constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(
        constrainedEnumModel,
        enumModel,
        constrainedEnumKey,
        constraints.NAMING_FORMATTER
      );
    }
    constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
    return constrainedEnumKey;
  };
}

export function defaultEnumValueConstraints(): CSharpEnumValueConstraint {
  return ({ enumValue }) => {
    let normalizedEnumValue;
    if(enumValue === null) return enumValue;
    if(Array.isArray(enumValue)) return `"${JSON.stringify(enumValue).replace(
      /"/g,
      '\\"'
    )}"`;
    switch (typeof enumValue) {
      case 'boolean':
      case 'bigint':
      case 'number': {
        normalizedEnumValue = enumValue;
        break;
      }
      case 'object': {
        normalizedEnumValue = `"${JSON.stringify(enumValue).replace(
          /"/g,
          '\\"'
        )}"`;
        break;
      }
      default: {
        normalizedEnumValue = `"${enumValue}"`;
      }
    }
    return normalizedEnumValue;
  };
}
