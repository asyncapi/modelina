/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';

export type ModelNameConstraints = {
  NO_SPECIAL_CHAR?: (value: string) => string;
  NO_NUMBER_START_CHAR?: (value: string) => string;
  NO_EMPTY_VALUE?: (value: string) => string;
  NAMING_FORMATTER?: (value: string) => string;
  NO_RESERVED_KEYWORDS?: (value: string) => string;
};

export const DefaultModelNameConstraints: ModelNameConstraints = {
  NO_SPECIAL_CHAR: (value: string) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_', '$' because they are allowed
    return FormatHelpers.replaceSpecialCharacters(value, { exclude: [' ', '_', '$'], separator: '_' });
  },
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: (value: string) => {
    return FormatHelpers.toPascalCase(value);
  },
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedTypeScriptKeyword); 
  }
};
export type ModelNameContext = {
  modelName: string
}
export type ModelNameConstraintType = (context: ModelNameContext) => string;

export function defaultModelNameConstraints(customConstraints?: ModelNameConstraints): ModelNameConstraintType {
  const constraints = DefaultModelNameConstraints;
  if (customConstraints !== undefined) {
    if (customConstraints.NO_SPECIAL_CHAR !== undefined) {
      constraints.NO_SPECIAL_CHAR = customConstraints.NO_SPECIAL_CHAR;
    }
    if (customConstraints.NO_NUMBER_START_CHAR !== undefined) {
      constraints.NO_NUMBER_START_CHAR = customConstraints.NO_NUMBER_START_CHAR;
    }
    if (customConstraints.NO_EMPTY_VALUE !== undefined) {
      constraints.NO_EMPTY_VALUE = customConstraints.NO_EMPTY_VALUE;
    }
    if (customConstraints.NAMING_FORMATTER !== undefined) {
      constraints.NAMING_FORMATTER = customConstraints.NAMING_FORMATTER;
    }
    if (customConstraints.NO_RESERVED_KEYWORDS !== undefined) {
      constraints.NAMING_FORMATTER = customConstraints.NO_RESERVED_KEYWORDS;
    }
  }

  return ({modelName}) => {
    let constrainedValue = modelName;
    constrainedValue = constraints.NO_SPECIAL_CHAR!(constrainedValue);
    constrainedValue = constraints.NO_NUMBER_START_CHAR!(constrainedValue);
    constrainedValue = constraints.NO_EMPTY_VALUE!(constrainedValue);
    constrainedValue = constraints.NAMING_FORMATTER!(constrainedValue);
    constrainedValue = constraints.NO_RESERVED_KEYWORDS!(constrainedValue);
    return constrainedValue;
  };
}
