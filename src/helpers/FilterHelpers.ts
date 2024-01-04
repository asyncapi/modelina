import {
  ConstrainedDictionaryModel,
  ConstrainedObjectPropertyModel
} from '../models';

/**
 * Filter out all properties that are dictionary models with unwrap serialization type.
 */
export function getNormalProperties(
  properties: Record<string, ConstrainedObjectPropertyModel>
) {
  return Object.entries(properties).filter(
    ([, value]) =>
      !(value.property instanceof ConstrainedDictionaryModel) ||
      (value.property instanceof ConstrainedDictionaryModel &&
        value.property.serializationType !== 'unwrap')
  );
}

/**
 * Filter out all properties that are dictionary models with unwrap serialization type.
 */
export function getDictionary(
  properties: Record<string, ConstrainedObjectPropertyModel>
) {
  return Object.entries(properties).filter(
    ([, value]) =>
      value.property instanceof ConstrainedDictionaryModel &&
      value.property.serializationType === 'unwrap'
  );
}

/**
 * Filter properties and return unconstrained property names for each property
 */
export function getOriginalPropertyList(
  properties: Record<string, ConstrainedObjectPropertyModel>
) {
  return Object.entries(properties).map(([, model]) => {
    return model.unconstrainedPropertyName;
  });
}