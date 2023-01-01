/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConstrainedEnumModel, EnumModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_ENUM_KEYS, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { FormatHelpers, EnumKeyConstraint, EnumValueConstraint} from '../../../helpers';
import { isReservedCppKeyword } from '../Constants';

export type ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_DUPLICATE_KEYS: (constrainedEnumModel: ConstrainedEnumModel, enumModel: EnumModel, value: string, namingFormatter: (value: string) => string) => string;
  NO_EMPTY_VALUE: (value: string) => string;
  NAMING_FORMATTER: (value: string) => string;
  NO_RESERVED_KEYWORDS: (value: string) => string;
};

export const DefaultEnumKeyConstraints: ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_' because they are allowed as enum keys
    return FormatHelpers.replaceSpecialCharacters(value, { exclude: [' ', '_'], separator: '_' });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_KEYS: NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toConstantCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedCppKeyword); 
  }
};

/**
 * Default constraint logic for Cpp, which converts the enum key into a key that is compatible with Cpp 
 */
export function defaultEnumKeyConstraints(customConstraints?: Partial<ModelEnumKeyConstraints>): EnumKeyConstraint {
  const constraints = {...DefaultEnumKeyConstraints, ...customConstraints};

  return ({enumKey, enumModel, constrainedEnumModel}) => {
    let constrainedEnumKey = enumKey;
    constrainedEnumKey = constraints.NO_SPECIAL_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_NUMBER_START_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_EMPTY_VALUE(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS(constrainedEnumKey);
    //If the enum key has been manipulated, lets make sure it don't clash with existing keys
    if (constrainedEnumKey !== enumKey) {
      constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(constrainedEnumModel, enumModel, constrainedEnumKey, constraints.NAMING_FORMATTER!);
    }
    constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
    return constrainedEnumKey;
  };
}

/**
 * Convert the enum value to a value that is compatible with Cpp
 */
export function defaultEnumValueConstraints(): EnumValueConstraint {
  return ({enumValue}) => {
    let constrainedEnumValue = enumValue;
    switch (typeof enumValue) {
    case 'string':
    case 'boolean':
      constrainedEnumValue = `"${enumValue}"`;
      break;
    case 'bigint':
    case 'number': {
      constrainedEnumValue = enumValue;
      break;
    }
    case 'object': {
      constrainedEnumValue = `"${JSON.stringify(enumValue).replace(/"/g, '\\"')}"`;
      break;
    }
    default: {
      constrainedEnumValue = `"${JSON.stringify(enumValue)}"`;
    }
    }
    return constrainedEnumValue;
  };
}
