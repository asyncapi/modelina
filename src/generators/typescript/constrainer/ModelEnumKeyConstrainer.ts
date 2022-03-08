import { ConstrainedObjectModel, ObjectModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_PROPERTIES, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';

export type ModelEnumKeyConstraints = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_DUPLICATE_PROPERTIES: (constrainedObjectModel: ConstrainedObjectModel, objectModel: ObjectModel, propertyName: string, namingFormatter: (value: string) => string) => string;
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
  NO_DUPLICATE_PROPERTIES,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: (value: string) => {
    return FormatHelpers.toConstantCase(value);
  },
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedTypeScriptKeyword); 
  }
};
