/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConstrainedEnumModel, EnumModel } from '../../../models';
import {
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NO_RESERVED_KEYWORDS
} from '../../../helpers/Constraints';
import {
  FormatHelpers,
  EnumKeyConstraint,
  EnumValueConstraint
} from '../../../helpers';
import { isReservedRustKeyword } from '../Constants';
import {
  RustEnumKeyConstraint,
  RustEnumValueConstraint
} from '../RustGenerator';

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
      exclude: [' ', '_'],
      separator: '_'
    });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_KEYS: NO_DUPLICATE_ENUM_KEYS,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toPascalCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedRustKeyword);
  }
};

export function defaultEnumKeyConstraints(
  customConstraints?: Partial<ModelEnumKeyConstraints>
): RustEnumKeyConstraint {
  const constraints = { ...DefaultEnumKeyConstraints, ...customConstraints };

  return ({ enumKey, enumModel, constrainedEnumModel }) => {
    let constrainedEnumKey = enumKey;
    constrainedEnumKey = constraints.NO_SPECIAL_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_NUMBER_START_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_EMPTY_VALUE(constrainedEnumKey);
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

    constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS(constrainedEnumKey);
    // If the name is a reserved keyword, make sure to format it afterwards
    constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
    return constrainedEnumKey;
  };
}

export function defaultEnumValueConstraints(): RustEnumValueConstraint {
  return ({ enumValue }) => {
    return enumValue;
  };
}
