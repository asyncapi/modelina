import { ConstrainedEnumModel, EnumModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_ENUM_KEYS, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { EnumKeyConstraint, EnumValueConstraint, FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';

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
    return NO_RESERVED_KEYWORDS(value, isReservedTypeScriptKeyword); 
  }
};

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
      constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(constrainedEnumModel, enumModel, constrainedEnumKey, constraints.NAMING_FORMATTER);
    }
    constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
    return constrainedEnumKey;
  };
}

export function defaultEnumValueConstraints(): EnumValueConstraint {
  return ({enumValue}) => {
    let normalizedEnumValue;
    switch (typeof enumValue) {
    case 'string':
    case 'boolean':
      normalizedEnumValue = `"${enumValue}"`;
      break;
    case 'bigint':
    case 'number': {
      normalizedEnumValue = `${enumValue}`;
      break;
    }
    case 'object': {
      normalizedEnumValue = `'${JSON.stringify(enumValue)}'`;
      break;
    }
    default: {
      normalizedEnumValue = String(enumValue);
    }
    }
    return normalizedEnumValue;
  };
}
