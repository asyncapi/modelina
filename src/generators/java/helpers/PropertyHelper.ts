import { CommonModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { isReservedKeyword } from './ReservedKeywords';

export function GetPropertyName(model: CommonModel, originalPropertyName: string, propertyName: string = originalPropertyName): string {
  propertyName = FormatHelpers.toCamelCase(propertyName);
  if (isReservedKeyword(propertyName)) {
    propertyName = `_${propertyName}`;
  }
  const propertyList = Object.keys(model.properties || {});
  if ((originalPropertyName !== propertyName && propertyList.includes(propertyName))) {
    propertyName = `_${propertyName}`;
    return GetPropertyName(model, originalPropertyName, propertyName);
  }
  return propertyName;
}
