/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConstrainedEnumModel, EnumModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_ENUM_KEYS, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/CommonConstraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedCSharpKeyword } from '../Constants';

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
    return FormatHelpers.replaceSpecialCharacters(value, { exclude: ['_', '$'], separator: '_' });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_KEYS: NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toConstantCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedCSharpKeyword); 
  }
};

export type EnumKeyContext = {
  enumKey: string,
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel
}
export type EnumConstraintType = (context: EnumKeyContext, constraints?: ModelEnumKeyConstraints) => string;

export function defaultEnumKeyConstraints(customConstraints?: ModelEnumKeyConstraints): EnumConstraintType {
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
