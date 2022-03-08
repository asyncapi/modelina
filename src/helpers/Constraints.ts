import { ConstrainedObjectModel } from 'models/ConstrainedMetaModel';
import { ObjectModel } from 'models/MetaModel';

export function NO_NUMBER_START_CHAR(value: string): string {
  const firstChar = value.charAt(0);
  if (isNaN(+firstChar)) {
    return `number_${value}`;
  }
  return value;
}

export function NO_DUPLICATE_PROPERTIES(constrainedObjectModel: ConstrainedObjectModel, objectModel: ObjectModel, propertyName: string, namingFormatter: (value: string) => string): string {
  let newPropertyName = propertyName;

  const alreadyPartOfMetaModelProperties = Object.keys(objectModel.properties).includes(propertyName);
  const alreadyPartOfNewProperties = Object.keys(constrainedObjectModel.properties).includes(propertyName);
  if (alreadyPartOfMetaModelProperties || alreadyPartOfNewProperties) {
    newPropertyName = `reserved_${propertyName}`;
    newPropertyName = namingFormatter(newPropertyName);
    [newPropertyName] = NO_DUPLICATE_PROPERTIES(constrainedObjectModel, objectModel, newPropertyName, namingFormatter);
  }
  return newPropertyName;
}

export function NO_EMPTY_VALUE(value: string): string {
  if (value === '') {
    return 'empty';
  }
  return value;
}

export function NO_RESERVED_KEYWORDS(
  propertyName: string,
  reservedKeywordCallback: (value: string) => boolean): string {
  if (reservedKeywordCallback(propertyName)) { 
    return `reserved_${propertyName}`;
  }
  return propertyName;
}
