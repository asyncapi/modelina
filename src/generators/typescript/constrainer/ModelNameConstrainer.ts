import { NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';

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

export function ConstrainModelName(value: string, constrainRules: ModelNameConstraints): string {
  let constrainedValue = value;
  constrainedValue = constrainRules.NO_SPECIAL_CHAR(constrainedValue);
  constrainedValue = constrainRules.NO_NUMBER_START_CHAR(constrainedValue);
  constrainedValue = constrainRules.NO_EMPTY_VALUE(constrainedValue);
  constrainedValue = constrainRules.NAMING_FORMATTER(constrainedValue);
  constrainedValue = constrainRules.NO_RESERVED_KEYWORDS(constrainedValue);
  return constrainedValue;
}
