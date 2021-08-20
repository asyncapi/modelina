import { TypeScriptRenderer } from '../../TypeScriptRenderer';
import { CommonModel } from '../../../../models';

/**
 * LAZY implementation, find first acceptable value
 * 
 * @param model 
 */
export function renderValueFromModel(model: CommonModel, renderer: TypeScriptRenderer): string | undefined {
  if (Array.isArray(model.enum) && model.enum.length > 0) {
    return JSON.stringify(model.enum[0]);
  }
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

export function renderValueFromType(modelType: string | undefined, model: CommonModel, renderer: TypeScriptRenderer): string | undefined {
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
    //Check and see if it should be rendered as tuples 
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
/**
 * Render `example` function based on model properties
 */
export default function renderExampleFunction({ renderer, model }: {
  renderer: TypeScriptRenderer,
  model: CommonModel,
}): string {
  const properties = model.properties || {};
  const setProperties = [];
  for (const [propertyName, property] of Object.entries(properties)) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const potentialRenderedValue = renderValueFromModel(property, renderer);
    if (potentialRenderedValue === undefined) {
      //Unable to determine example value, skip property.
      continue;
    }
    setProperties.push(`  instance.${formattedPropertyName} = ${potentialRenderedValue};`);
  }
  const formattedModelName = renderer.nameType(model.$id);
  return `public static example(): ${formattedModelName} {
  const instance = new ${formattedModelName}({} as any);
${(setProperties.join('\n'))}
  return instance;
}`;
}
