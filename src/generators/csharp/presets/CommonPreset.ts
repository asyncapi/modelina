import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';

import { getUniquePropertyName, FormatHelpers, DefaultPropertyNames } from '../../../helpers';
import { CommonModel } from '../../../models';

export interface CSharpCommonPresetOptions {
  equal: boolean;
  hash: boolean;
}

/**
 * Render `equal` function based on model's properties
 */
function renderEqual({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const properties = model.properties || {};
  const propertyKeys = [...Object.keys(properties), getUniquePropertyName(model, DefaultPropertyNames.additionalProperties)];
  const equalProperties = propertyKeys.map(prop => {
    const accessorMethodProp = FormatHelpers.upperFirst(renderer.nameProperty(prop));
    return `${accessorMethodProp} == model.${accessorMethodProp}`;
  }).join(' &&\n');

  return `public override bool Equals(object obj)
{
  return obj is ${formattedModelName} model &&
${renderer.indent(equalProperties, 4)};
}`;
} 

/**
 * Render `hashCode` function based on model's properties
 */
function renderHashCode({ renderer, model }: {
  renderer: CSharpRenderer,
  model: CommonModel,
}): string {
  const properties = model.properties || {};
  const propertyKeys = [...Object.keys(properties), getUniquePropertyName(model, DefaultPropertyNames.additionalProperties)];
  const hashProperties = propertyKeys.map(prop => FormatHelpers.upperFirst(renderer.nameProperty(prop))).join(', ');

  return `public override int GetHashCode()
{
  return HashCode.Combine(${hashProperties});
}
`;
} 

/**
 * Preset which adds `Equals`, `GetHashCode` functions to class. 
 * 
 * @implements {CSharpPreset}
 */
export const CSHARP_COMMON_PRESET: CSharpPreset = {
  class: {
    additionalContent({ renderer, model, content, options }) {
      options = options || {};
      const blocks: string[] = [];
      
      if (options.equal === undefined || options.equal === true) {blocks.push(renderEqual({ renderer, model }));}
      if (options.hashCode === undefined || options.hashCode === true) {blocks.push(renderHashCode({ renderer, model }));}

      return renderer.renderBlock([content, ...blocks], 2);
    },
  }
};
