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
import { isReservedGoKeyword } from '../Constants';
import { GoEnumKeyConstraint, GoEnumValueConstraint } from '../GoGenerator';

export type ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_DUPLICATE_KEYS: (
    constrainedEnumModel: ConstrainedEnumModel,
    enumModel: EnumModel,
    newEnumKey: string,
    namingFormatter: (value: string) => string,
    enumKeyToCheck: string,
    onNameChange: () => string,
    onNameChangeToCheck: () => string
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
  NAMING_FORMATTER: FormatHelpers.toPascalCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedGoKeyword);
  }
};

export function defaultEnumKeyConstraints(
  customConstraints?: Partial<ModelEnumKeyConstraints>
): GoEnumKeyConstraint {
  const constraints = { ...DefaultEnumKeyConstraints, ...customConstraints };

  return ({ enumKey, enumModel, constrainedEnumModel }) => {
    let constrainedEnumKey = enumKey;
    constrainedEnumKey = constraints.NO_SPECIAL_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_NUMBER_START_CHAR(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_EMPTY_VALUE(constrainedEnumKey);
    constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS(constrainedEnumKey);
    //If the enum key has been manipulated, lets make sure it don't clash with existing keys
    if (constrainedEnumKey !== enumKey) {
      //Must check against the enum key with the constrained enum model name
      constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(
        constrainedEnumModel,
        enumModel,
        constrainedEnumKey,
        constraints.NAMING_FORMATTER,
        `${constrainedEnumModel.name}_${constrainedEnumKey}`,
        () => {
          return `reserved_${constrainedEnumKey}`;
        },
        () => {
          return `${constrainedEnumModel.name}_reserved_${constrainedEnumKey}`;
        }
      );
    }
    constrainedEnumKey = `${constrainedEnumModel.name}_${constrainedEnumKey}`;
    constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
    return constrainedEnumKey;
  };
}

export function defaultEnumValueConstraints(): GoEnumValueConstraint {
  return ({ enumValue }) => {
    let constrainedEnumValue: any = JSON.stringify(enumValue);
    switch (typeof enumValue) {
      case 'string':
        constrainedEnumValue = `"${enumValue}"`;
        break;
      case 'number':
      case 'bigint':
        constrainedEnumValue = enumValue;
        break;
    }
    return constrainedEnumValue;
  };
}
