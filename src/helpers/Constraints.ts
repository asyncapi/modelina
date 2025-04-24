import {
  ConstrainedObjectModel,
  ConstrainedEnumModel,
  ConstrainedUnionModel
} from '../models/ConstrainedMetaModel';
import { ObjectModel, EnumModel, UnionModel } from '../models/MetaModel';

export function NO_NUMBER_START_CHAR(value: string): string {
  const firstChar = value.charAt(0);
  if (firstChar !== '' && !isNaN(+firstChar)) {
    return `number_${value}`;
  }
  return value;
}

/**
 * Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the property names by append, prepend, or manipulate it any other way.
 * We then need to make sure that they don't clash with any existing properties, this is what this function handles.
 * If so, prepend `reserved_` to the property name and recheck.
 *
 * @param constrainedObjectModel the current constrained object model, which contains already existing constrained properties
 * @param objectModel the raw object model which is non-constrained to the output language.
 * @param propertyName one of the properties in objectModel which might have been manipulated
 * @param namingFormatter the name formatter which are used to format the property key
 */
export function NO_DUPLICATE_PROPERTIES(
  constrainedObjectModel: ConstrainedObjectModel | ConstrainedUnionModel,
  objectModel: ObjectModel | UnionModel,
  propertyName: string,
  namingFormatter: (value: string) => string
): string {
  // Make sure that the given property name is formatted correctly for further comparisons
  const formattedPropertyName = namingFormatter(propertyName);
  let newPropertyName = propertyName;
  const alreadyPartOfMetaModel = Object.keys(objectModel.properties)
    .filter((key) => propertyName !== key) // Filter out the potential same property name that we can safely ignore for this check.
    .includes(formattedPropertyName);
  const alreadyPartOfConstrainedModel = Object.keys(
    constrainedObjectModel.properties
  ).includes(formattedPropertyName);
  if (alreadyPartOfMetaModel || alreadyPartOfConstrainedModel) {
    newPropertyName = `reserved_${propertyName}`;
    newPropertyName = NO_DUPLICATE_PROPERTIES(
      constrainedObjectModel,
      objectModel,
      newPropertyName,
      namingFormatter
    );
  }
  return newPropertyName;
}

/**
 * Because a lot of the other constrain functions (such as NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, etc) they might manipulate the enum keys by append, prepend, or manipulate it any other way.
 * We then need to make sure that they don't clash with any existing enum keys, this is what this function handles.
 * If so, prepend `reserved_` to the enum key and recheck.
 *
 * @param constrainedEnumModel the current constrained enum model, which contains already existing constrained enum keys
 * @param enumModel the raw enum model which is non-constrained to the output language.
 * @param enumKey one of the enum keys in enumModel which might have been manipulated.
 * @param namingFormatter the name formatter which are used to format the enum key.
 * @param enumKeyToCheck the enum key to use for checking if it already exist, defaults to enumKey.
 * @param onNameChange callback to change the name of the enum key that needs to be returned.
 * @param onNameChangeToCheck callback to change the enum key which is being checked as part of the existing models.
 * @returns {string} the potential new enum key that does not clash with existing enum keys.
 */
export function NO_DUPLICATE_ENUM_KEYS(
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel,
  enumKey: string,
  namingFormatter: (value: string) => string,
  enumKeyToCheck: string = enumKey,
  onNameChange: (currentEnumKey: string) => string = (currentEnumKey) => {
    return `reserved_${currentEnumKey}`;
  },
  onNameChangeToCheck: (currentEnumKey: string) => string = onNameChange
): string {
  const formattedEnumKey = namingFormatter(enumKeyToCheck);
  let newEnumKey = enumKey;

  const alreadyPartOfMetaModel = enumModel.values
    .map((model) => model.key)
    .filter((key) => enumKeyToCheck !== key)
    .includes(formattedEnumKey);
  const alreadyPartOfConstrainedModel = constrainedEnumModel.values
    .map((model) => model.key)
    .includes(formattedEnumKey);

  if (alreadyPartOfMetaModel || alreadyPartOfConstrainedModel) {
    newEnumKey = onNameChange(newEnumKey);
    enumKeyToCheck = onNameChangeToCheck(enumKeyToCheck);
    newEnumKey = NO_DUPLICATE_ENUM_KEYS(
      constrainedEnumModel,
      enumModel,
      newEnumKey,
      namingFormatter,
      enumKeyToCheck,
      onNameChange,
      onNameChangeToCheck
    );
  }
  return newEnumKey;
}

export function NO_EMPTY_VALUE(value: string): string {
  if (value === '') {
    return 'empty';
  }
  return value;
}

export function NO_RESERVED_KEYWORDS(
  propertyName: string,
  reservedKeywordCallback: (value: string) => boolean
): string {
  if (reservedKeywordCallback(propertyName)) {
    return `reserved_${propertyName}`;
  }
  return propertyName;
}

export function checkForReservedKeyword(
  word: string,
  wordList: string[],
  forceLowerCase = true
): boolean {
  let wordListToCheck = [...wordList];
  let wordToCheck = word;
  if (forceLowerCase) {
    wordListToCheck = wordListToCheck.map((value) => value.toLowerCase());
    wordToCheck = wordToCheck.toLowerCase();
  }
  return wordListToCheck.includes(wordToCheck);
}
