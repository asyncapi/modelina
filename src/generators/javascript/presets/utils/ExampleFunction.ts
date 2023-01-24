import {
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
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
 * Render specific example values
 * @param model
 */
export function renderValueFromModel(
  model: ConstrainedMetaModel
): string | undefined {
  if (model instanceof ConstrainedReferenceModel) {
    return `${model.ref.type}.example()`;
  } else if (model instanceof ConstrainedUnionModel) {
    //Greedy example, where we just use the first type of the union models
    return renderValueFromModel(model.union[0]);
  } else if (model instanceof ConstrainedStringModel) {
    return '"string"';
  } else if (
    model instanceof ConstrainedFloatModel ||
    model instanceof ConstrainedIntegerModel
  ) {
    return '0';
  } else if (model instanceof ConstrainedBooleanModel) {
    return 'true';
  } else if (model instanceof ConstrainedArrayModel) {
    const value = renderValueFromModel(model.valueModel);
    return `[${value}]`;
  } else if (model instanceof ConstrainedTupleModel) {
    const values = model.tuple.map((tupleModel) =>
      renderValueFromModel(tupleModel.value)
    );
    return `[${values.join(', ')}]`;
  }
  return undefined;
}

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
      continue;
    }
    setProperties.push(
      `  instance.${propertyName} = ${potentialRenderedValue};`
    );
  }
  return `example(){
  const instance = new ${model.name}({});
${setProperties.join('\n')}
  return instance;
}`;
}
