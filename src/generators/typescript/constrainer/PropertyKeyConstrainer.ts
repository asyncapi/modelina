import { ConstrainedObjectModel, ObjectModel } from '../../../models';
import {
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_PROPERTIES,
  NO_EMPTY_VALUE,
  NO_RESERVED_KEYWORDS
} from '../../../helpers/Constraints';
import { FormatHelpers } from '../../../helpers';
import { isReservedTypeScriptKeyword } from '../Constants';
import {
  TypeScriptOptions,
  TypeScriptPropertyKeyConstraint
} from '../TypeScriptGenerator';

export type PropertyKeyConstraintOptions = {
  NO_SPECIAL_CHAR: (value: string) => string;
  NO_NUMBER_START_CHAR: (value: string) => string;
  NO_DUPLICATE_PROPERTIES: (
    constrainedObjectModel: ConstrainedObjectModel,
    objectModel: ObjectModel,
    propertyName: string,
    namingFormatter: (value: string) => string
  ) => string;
  NO_EMPTY_VALUE: (value: string) => string;
  NAMING_FORMATTER: (value: string) => string;
  NO_RESERVED_KEYWORDS: (value: string, options: TypeScriptOptions) => string;
};

export const DefaultPropertyKeyConstraints: PropertyKeyConstraintOptions = {
  NO_SPECIAL_CHAR: (value) => {
    //Exclude ` ` because it gets formatted by NAMING_FORMATTER
    //Exclude '_', '$' because they are allowed
    return FormatHelpers.replaceSpecialCharacters(value, {
      exclude: [' ', '_', '$'],
      separator: '_'
    });
  },
  NO_NUMBER_START_CHAR,
  NO_DUPLICATE_PROPERTIES,
  NO_EMPTY_VALUE,
  NAMING_FORMATTER: FormatHelpers.toCamelCase,
  NO_RESERVED_KEYWORDS: (value, options) => {
    return NO_RESERVED_KEYWORDS(value, (word) =>
      isReservedTypeScriptKeyword(word, true, options)
    );
  }
};
export function defaultPropertyKeyConstraints(
  customConstraints?: Partial<PropertyKeyConstraintOptions>
): TypeScriptPropertyKeyConstraint {
  const constraints = {
    ...DefaultPropertyKeyConstraints,
    ...customConstraints
  };

  return ({
    objectPropertyModel,
    constrainedObjectModel,
    objectModel,
    options
  }) => {
    let constrainedPropertyKey = objectPropertyModel.propertyName;

    constrainedPropertyKey = constraints.NO_SPECIAL_CHAR(
      constrainedPropertyKey
    );
    constrainedPropertyKey = constraints.NO_NUMBER_START_CHAR(
      constrainedPropertyKey
    );
    constrainedPropertyKey = constraints.NO_EMPTY_VALUE(constrainedPropertyKey);
    constrainedPropertyKey = constraints.NO_RESERVED_KEYWORDS(
      constrainedPropertyKey,
      options
    );
    //If the property name has been manipulated, lets make sure it don't clash with existing properties
    if (constrainedPropertyKey !== objectPropertyModel.propertyName) {
      constrainedPropertyKey = constraints.NO_DUPLICATE_PROPERTIES(
        constrainedObjectModel,
        objectModel,
        constrainedPropertyKey,
        constraints.NAMING_FORMATTER
      );
    }
    constrainedPropertyKey = constraints.NAMING_FORMATTER(
      constrainedPropertyKey
    );
    return constrainedPropertyKey;
  };
}
