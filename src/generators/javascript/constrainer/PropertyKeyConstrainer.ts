/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConstrainedObjectModel, ObjectModel } from '../../../models';
import { NO_NUMBER_START_CHAR, NO_DUPLICATE_PROPERTIES, NO_EMPTY_VALUE, NO_RESERVED_KEYWORDS} from '../../../helpers/CommonConstraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedJavaScriptKeyword } from '../Constants';

export type PropertyKeyConstraintOptions = {
  NO_SPECIAL_CHAR?: (value: string) => string;
  NO_NUMBER_START_CHAR?: (value: string) => string;
  NO_DUPLICATE_PROPERTIES?: (constrainedObjectModel: ConstrainedObjectModel, objectModel: ObjectModel, propertyName: string, namingFormatter: (value: string) => string) => string;
  NO_EMPTY_VALUE?: (value: string) => string;
  NAMING_FORMATTER?: (value: string) => string;
  NO_RESERVED_KEYWORDS?: (value: string) => string;
};

export const DefaultPropertyKeyConstraints: PropertyKeyConstraintOptions = {
  NO_SPECIAL_CHAR: (value: string) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_', '$' because they are allowed
    return FormatHelpers.replaceSpecialCharacters(value, { exclude: [' ', '_', '$'], separator: '_' });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_PROPERTIES,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toPascalCase,
  NO_RESERVED_KEYWORDS: (value: string) => {
    return NO_RESERVED_KEYWORDS(value, isReservedJavaScriptKeyword); 
  }
};

export type PropertyKeyContext = {
  propertyKey: string,
  constrainedObjectModel: ConstrainedObjectModel,
  objectModel: ObjectModel
}

export type PropertyKeyConstraintType = (context: PropertyKeyContext) => string;

export function defaultPropertyKeyConstraints(customConstraints?: PropertyKeyConstraintOptions): PropertyKeyConstraintType {
  const constraints = DefaultPropertyKeyConstraints;
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
    if (customConstraints.NO_EMPTY_VALUE !== undefined) {
      constraints.NO_EMPTY_VALUE = customConstraints.NO_EMPTY_VALUE;
    }
    if (customConstraints.NO_RESERVED_KEYWORDS !== undefined) {
      constraints.NO_RESERVED_KEYWORDS = customConstraints.NO_RESERVED_KEYWORDS;
    }
    if (customConstraints.NO_DUPLICATE_PROPERTIES !== undefined) {
      constraints.NO_DUPLICATE_PROPERTIES = customConstraints.NO_DUPLICATE_PROPERTIES;
    }
  }
  return ({propertyKey, constrainedObjectModel, objectModel}: PropertyKeyContext) => {
    let constrainedPropertyKey = propertyKey;

    constrainedPropertyKey = constraints.NO_SPECIAL_CHAR!(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NO_NUMBER_START_CHAR!(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NO_EMPTY_VALUE!(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NO_RESERVED_KEYWORDS!(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NAMING_FORMATTER!(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NO_DUPLICATE_PROPERTIES!(constrainedObjectModel, objectModel, constrainedPropertyKey, constraints.NAMING_FORMATTER!);
    return constrainedPropertyKey;
  };
}
