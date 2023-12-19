import {
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NO_RESERVED_KEYWORDS
} from '../../../helpers/Constraints';
import { FormatHelpers, ModelNameConstraint } from '../../../helpers';
import { isReservedRustKeyword } from '../Constants';
import { RustModelNameConstraint } from '../RustGenerator';

export type ModelNameConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_EMPTY_VALUE: (value: string) => string;
  NAMING_FORMATTER: (value: string) => string;
  NO_RESERVED_KEYWORDS: (value: string) => string;
};

export const DefaultModelNameConstraints: ModelNameConstraints = {
  NO_SPECIAL_CHAR: (value: string) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_', '$' because they are allowed
    return FormatHelpers.replaceSpecialCharacters(value, {
      exclude: [' ', '_', '$'],
      separator: '_'
    });
  },
  NO_NUMBER_START_CHAR,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: (value: string) => {
    return FormatHelpers.toPascalCaseMergingNumbers(value);
  },
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedRustKeyword);
  }
};
export function defaultModelNameConstraints(
  customConstraints?: Partial<ModelNameConstraints>
): RustModelNameConstraint {
  const constraints = { ...DefaultModelNameConstraints, ...customConstraints };

  return ({ modelName }) => {
    let constrainedValue = modelName;
    constrainedValue = constraints.NO_SPECIAL_CHAR(constrainedValue);
    constrainedValue = constraints.NO_NUMBER_START_CHAR(constrainedValue);
    constrainedValue = constraints.NO_EMPTY_VALUE(constrainedValue);
    constrainedValue = constraints.NAMING_FORMATTER(constrainedValue);

    constrainedValue = constraints.NO_RESERVED_KEYWORDS(constrainedValue);
    // If the name is a reserved keyword, make sure to format it afterwards
    constrainedValue = constraints.NAMING_FORMATTER(constrainedValue);

    return constrainedValue;
  };
}
