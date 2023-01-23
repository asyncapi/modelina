import {
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../../../../models';

/**
 * Inferring first acceptable value from the model.
 *
 * @param model
 */
export function renderValueFromModel(
  model: ConstrainedMetaModel
): string | undefined {
  if (model instanceof ConstrainedEnumModel && model.values.length > 0) {
    //Greedy example
    return model.values[0].value;
  } else if (model instanceof ConstrainedReferenceModel) {
    return `${model.name}.example()`;
  } else if (model instanceof ConstrainedUnionModel && model.union.length > 0) {
    //Greedy example
    return renderValueFromModel(model.union[0]);
  } else if (model instanceof ConstrainedArrayModel) {
    const arrayType = renderValueFromModel(model.valueModel);
    return `[${arrayType}]`;
  } else if (model instanceof ConstrainedTupleModel && model.tuple.length > 0) {
    const values = model.tuple.map((tupleModel) => {
      return renderValueFromModel(tupleModel.value);
    });
    return `[${values.join(',')}]`;
  } else if (model instanceof ConstrainedStringModel) {
    return '"string"';
  } else if (model instanceof ConstrainedIntegerModel) {
    return '0';
  } else if (model instanceof ConstrainedFloatModel) {
    return '0.0';
  } else if (model instanceof ConstrainedBooleanModel) {
    return 'true';
  }
  return undefined;
}

/**
 * Render `example` function based on model properties.
 */
export default function renderExampleFunction({
  model
}: {
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const setProperties = [];
  for (const [propertyName, property] of Object.entries(properties)) {
    const potentialRenderedValue = renderValueFromModel(property.property);
    if (potentialRenderedValue === undefined) {
      //Unable to determine example value, skip property.
      continue;
    }
    setProperties.push(
      `  instance.${propertyName} = ${potentialRenderedValue};`
    );
  }
  return `public static example(): ${model.type} {
  const instance = new ${model.type}({} as any);
${setProperties.join('\n')}
  return instance;
}`;
}
