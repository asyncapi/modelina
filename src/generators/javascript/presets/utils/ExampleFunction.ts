import { JavaScriptRenderer } from '../../JavaScriptRenderer';
import { CommonModel } from '../../../../models';

export function renderValueFromModel(model: CommonModel, renderer: JavaScriptRenderer): string | undefined {
  if (model.$ref !== undefined) {
    return `${renderer.nameType(model.$ref)}.example()`;
  }
  if (Array.isArray(model.type)) {
    if (model.type.length > 0) {
      return renderValueFromType(model.type[0], model, renderer);
    }
    return undefined;
  }
  return renderValueFromType(model.type, model, renderer);
}

export function renderValueFromType(modelType: string | undefined, model: CommonModel, renderer: JavaScriptRenderer): string | undefined {
  if (modelType === undefined) {
    return undefined;
  }
  switch (modelType) {
  case 'string':
    return '"string"';
  case 'integer':
  case 'number':
    return '0';
  case 'boolean':
    return 'true';
  case 'array': {
    if (model.items === undefined) {
      return '[]';
    }
    if (Array.isArray(model.items)) {
      const arrayValues = model.items.map((item) => {
        return renderValueFromModel(item, renderer);
      });
      return `[${arrayValues.join(', ')}]`;
    }
    const arrayType = renderValueFromModel(model.items, renderer);
    return `[${arrayType}]`;
  }
  }
  return undefined;
}

export default function renderExampleFunction({ renderer, model }: {
    renderer: JavaScriptRenderer,
    model: CommonModel
}): string {
  const properties = model.properties || {};
  const setProperties = [];
  for (const [propertyName, property] of Object.entries(properties)) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const potentialRenderedValue = renderValueFromModel(property, renderer);
    if (potentialRenderedValue === undefined) {
      continue;
    }
    setProperties.push(`  instance.${formattedPropertyName} = ${potentialRenderedValue};`);
  }
  const formattedModelName = renderer.nameType(model.$id);
  return `example(){
  const instance = new ${formattedModelName}({});
${(setProperties.join('\n'))}
  return instance;
}`;
}
