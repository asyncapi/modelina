import { CSharpRenderer } from '../CSharpRenderer';
import { CSharpPreset } from '../CSharpPreset';
import { FormatHelpers } from '../../../helpers';
import { ConstrainedObjectModel } from '../../../models';

export interface CSharpCommonPresetOptions {
  equal: boolean;
  hash: boolean;
}

/**
 * Render `equal` function based on model's properties
 */
function renderEqual({
  renderer,
  model
}: {
  renderer: CSharpRenderer<any>;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const propertyKeys = Object.keys(properties);
  let equalProperties = propertyKeys
    .map((propertyName) => {
      const accessorMethodProp = FormatHelpers.upperFirst(propertyName);
      return `${accessorMethodProp} == model.${accessorMethodProp}`;
    })
    .join(' && \n');
  equalProperties = `return ${
    equalProperties !== '' ? equalProperties : 'true'
  }`;
  const methodContent = `if(obj is ${model.name} model)
{
${renderer.indent('if(ReferenceEquals(this, model)) { return true; }')}
${renderer.indent(equalProperties)};
}

return false;`;

  return `public override bool Equals(object obj)
{
${renderer.indent(methodContent)}
}`;
}

/**
 * Render `hashCode` function based on model's properties
 */
function renderHashCode({
  renderer,
  model
}: {
  renderer: CSharpRenderer<any>;
  model: ConstrainedObjectModel;
}): string {
  const properties = model.properties || {};
  const propertyKeys = Object.keys(properties);
  const hashProperties = propertyKeys
    .map(
      (propertyName) => `hash.Add(${FormatHelpers.upperFirst(propertyName)});`
    )
    .join('\n');

  return `public override int GetHashCode()
{
  HashCode hash = new HashCode();
${renderer.indent(hashProperties, 2)}
  return hash.ToHashCode();
}`;
}

/**
 * Preset which adds `Equals`, `GetHashCode` functions to class.
 *
 * @implements {CSharpPreset}
 */
export const CSHARP_COMMON_PRESET: CSharpPreset<CSharpCommonPresetOptions> = {
  class: {
    additionalContent({ renderer, model, content, options }) {
      options = options || {};
      const blocks: string[] = [];

      if (options.equal === undefined || options.equal === true) {
        blocks.push(renderEqual({ renderer, model }));
      }
      if (options.hash === undefined || options.hash === true) {
        renderer.dependencyManager.addDependency('using System;');
        blocks.push(renderHashCode({ renderer, model }));
      }

      return renderer.renderBlock([content, ...blocks], 2);
    }
  }
};
