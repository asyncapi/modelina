/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConstrainedEnumModel, EnumModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_ENUM_KEYS, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedJavaKeyword } from '../Constants';
import { EnumKeyConstraint, EnumValueConstraint } from 'helpers/ConstrainHelpers';

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
    //Exclude '_', '$' because they are allowed as enum keys
    return FormatHelpers.replaceSpecialCharacters(value, { exclude: [' ', '_'], separator: '_' });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_KEYS: NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toConstantCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedJavaKeyword); 
  }
};

export function defaultEnumKeyConstraints(customConstraints?: ModelEnumKeyConstraints): EnumKeyConstraint {
  const constraints = DefaultEnumKeyConstraints;
  if (customConstraints !== undefined) {
    if (customConstraints.NAMING_FORMATTER !== undefined) {
      constraints.NAMING_FORMATTER = customConstraints.NAMING_FORMATTER;
    }
    if (customConstraints.NO_SPECIAL_CHAR !== undefined) {
      constraints.NO_SPECIAL_CHAR = customConstraints.NO_SPECIAL_CHAR;
    }
    if (customConstraints.NO_NUMBER_START_CHAR !== undefined) {
      constraints.NO_NUMBER_START_CHAR = customConstraints.NO_NUMBER_START_CHAR;
    }
    if (customConstraints.NO_RESERVED_KEYWORDS !== undefined) {
      constraints.NO_RESERVED_KEYWORDS = customConstraints.NO_RESERVED_KEYWORDS;
    }
    if (customConstraints.NO_DUPLICATE_KEYS !== undefined) {
      constraints.NO_DUPLICATE_KEYS = customConstraints.NO_DUPLICATE_KEYS;
    }
  }
  return ({enumKey, enumModel, constrainedEnumModel}) => {
    let constrainedEnumKey = enumKey;
    constrainedEnumKey = constraints.NO_SPECIAL_CHAR!(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_NUMBER_START_CHAR!(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_EMPTY_VALUE!(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS!(constrainedEnumKey);
    constrainedEnumKey = constraints.NAMING_FORMATTER!(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_DUPLICATE_KEYS!(constrainedEnumModel, enumModel, constrainedEnumKey, constraints.NAMING_FORMATTER!);
    return constrainedEnumKey;
  };
}

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
      constrainedEnumValue = String(enumValue);
    }
    }
    return constrainedEnumValue;
  };
}
