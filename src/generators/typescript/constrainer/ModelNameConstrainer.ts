import {
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NO_RESERVED_KEYWORDS
} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';
import { TypeScriptModelNameConstraint, TypeScriptOptions } from '../TypeScriptGenerator';

export type ModelNameConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_EMPTY_VALUE: (value: string) => string;
  NAMING_FORMATTER: (value: string) => string;
  NO_RESERVED_KEYWORDS: (value: string, options: TypeScriptOptions) => string;
};

export const DefaultModelNameConstraints: ModelNameConstraints = {
  NO_SPECIAL_CHAR: (value) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_', '$' because they are allowed
    return FormatHelpers.replaceSpecialCharacters(value, {
      exclude: [' ', '_', '$'],
      separator: '_'
    });
  },
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: (value) => {
    return FormatHelpers.toPascalCase(value);
  },
  NO_RESERVED_KEYWORDS: (value, options) => {
    return NO_RESERVED_KEYWORDS(value, (word) => isReservedTypeScriptKeyword(word, true, options));
  }
};
export function defaultModelNameConstraints(
  customConstraints?: Partial<ModelNameConstraints>
): TypeScriptModelNameConstraint {
  const constraints = { ...DefaultModelNameConstraints, ...customConstraints };

  return ({ modelName, options }) => {
    let constrainedValue = modelName;
    constrainedValue = constraints.NO_SPECIAL_CHAR(constrainedValue);
    constrainedValue = constraints.NO_NUMBER_START_CHAR(constrainedValue);
    constrainedValue = constraints.NO_EMPTY_VALUE(constrainedValue);
    constrainedValue = constraints.NO_RESERVED_KEYWORDS(constrainedValue, options);
    constrainedValue = constraints.NAMING_FORMATTER(constrainedValue);
    return constrainedValue;
  };
}
