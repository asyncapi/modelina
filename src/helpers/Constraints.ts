import { ConstrainedObjectModel, ConstrainedEnumModel} from '../models/ConstrainedMetaModel';
import { ObjectModel, EnumModel } from '../models/MetaModel';

export function NO_NUMBER_START_CHAR(value: string): string {
  const firstChar = value.charAt(0);
  if (isNaN(+firstChar)) {
    return `number_${value}`;
  }
  return value;
}

/**
 * Makes sure that no duplicate properties can be created. 
 */
export function NO_DUPLICATE_PROPERTIES(constrainedObjectModel: ConstrainedObjectModel, objectModel: ObjectModel, propertyName: string, namingFormatter: (value: string) => string): string {
  let newPropertyName = propertyName;

  const alreadyPartOfMetaModel = Object.keys(objectModel.properties).map((key) => namingFormatter(key)).includes(propertyName);
  const alreadyPartOfConstrainedModel = Object.keys(constrainedObjectModel.properties).includes(propertyName);
  if (alreadyPartOfMetaModel || alreadyPartOfConstrainedModel) {
    newPropertyName = `reserved_${propertyName}`;
    newPropertyName = namingFormatter(newPropertyName);
    newPropertyName = NO_DUPLICATE_PROPERTIES(constrainedObjectModel, objectModel, newPropertyName, namingFormatter);
  }
  return newPropertyName;
}

export function NO_DUPLICATE_ENUM_KEYS(constrainedEnumModel: ConstrainedEnumModel, enumModel: EnumModel, enumKey: string, namingFormatter: (value: string) => string): string {
  let newEnumKey = enumKey;

  const alreadyPartOfMetaModel = constrainedEnumModel.values.map((model) => model.key).map((key) => namingFormatter(key)).includes(enumKey);
  const alreadyPartOfConstrainedModel = constrainedEnumModel.values.map((model) => model.key).includes(enumKey);

  if (alreadyPartOfMetaModel || alreadyPartOfConstrainedModel) {
    newEnumKey = `reserved_${enumKey}`;
    newEnumKey = namingFormatter(enumKey);
    newEnumKey = NO_DUPLICATE_ENUM_KEYS(constrainedEnumModel, enumModel, newEnumKey, namingFormatter);
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
  reservedKeywordCallback: (value: string) => boolean): string {
  if (reservedKeywordCallback(propertyName)) { 
    return `reserved_${propertyName}`;
  }
  return propertyName;
}
