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
  for (const [pattern, patternModel] of Object.entries(model.patternProperties || {})) {
    propertyKeys.push(getUniquePropertyName(patternModel, `${pattern}${DefaultPropertyNames.patternProperties}`));
  }
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
  for (const [pattern, patternModel] of Object.entries(model.patternProperties || {})) {
    propertyKeys.push(getUniquePropertyName(patternModel, `${pattern}${DefaultPropertyNames.patternProperties}`));
  }
  const hashProperties = propertyKeys.map(prop => `hash.Add(${FormatHelpers.upperFirst(renderer.nameProperty(prop))});`).join('\n');

  return `public override int GetHashCode()
{
  HashCode hash = new HashCode();
  ${hashProperties}
  return hash.ToHashCode();
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
      if (options.hashCode === undefined || options.hashCode === true) {
        renderer.addDependency('using System;');
        blocks.push(renderHashCode({ renderer, model }));
      }

      return renderer.renderBlock([content, ...blocks], 2);
    },
  }
};
