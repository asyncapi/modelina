import { JavaRenderer } from '../JavaRenderer';
import { JavaPreset } from '../JavaPreset';

import { getUniquePropertyName, DefaultPropertyNames } from '../../../helpers';
import { CommonModel } from '../../../models';

export interface JavaCommonPresetOptions {
  equal: boolean;
  hash: boolean;
  classToString: boolean;
}

/**
 * Render `equal` function based on model's properties
 */
function renderEqual({ renderer, model }: {
  renderer: JavaRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const properties = model.properties || {};
  const propertyKeys = [...Object.keys(properties)];
  if (model.additionalProperties !== undefined) {
    propertyKeys.push(getUniquePropertyName(model, DefaultPropertyNames.additionalProperties));
  }
  const equalProperties = propertyKeys.map(prop => {
    const camelCasedProp = renderer.nameProperty(prop);
    return `Objects.equals(this.${camelCasedProp}, self.${camelCasedProp})`;
  }).join(' &&\n');

  return `${renderer.renderAnnotation('Override')}
public boolean equals(Object o) {
  if (this == o) {
    return true;
  }
  if (o == null || getClass() != o.getClass()) {
    return false;
  }
  ${formattedModelName} self = (${formattedModelName}) o;
    return 
${equalProperties.length > 0 ? renderer.indent(equalProperties, 6) : 'true'};
}`;
} 

/**
 * Render `hashCode` function based on model's properties
 */
function renderHashCode({ renderer, model }: {
  renderer: JavaRenderer,
  model: CommonModel,
}): string {
  const properties = model.properties || {};
  const propertyKeys = [...Object.keys(properties)];
  if (model.additionalProperties !== undefined) {
    propertyKeys.push(getUniquePropertyName(model, DefaultPropertyNames.additionalProperties));
  }
  const hashProperties = propertyKeys.map(prop => `(Object)${renderer.nameProperty(prop)}`).join(', ');

  return `${renderer.renderAnnotation('Override')}
public int hashCode() {
  return Objects.hash(${hashProperties});
}`;
} 

/**
 * Render `toString` function based on model's properties
 */
function renderToString({ renderer, model }: {
  renderer: JavaRenderer,
  model: CommonModel,
}): string {
  const formattedModelName = renderer.nameType(model.$id);
  const properties = model.properties || {};
  const propertyKeys = [...Object.keys(properties)];
  if (model.additionalProperties !== undefined) {
    propertyKeys.push(getUniquePropertyName(model, DefaultPropertyNames.additionalProperties));
  }
  const toStringProperties = propertyKeys.map(prop => { 
    const renderedPropertyName = renderer.nameProperty(prop);
    return `"    ${renderedPropertyName}: " + toIndentedString(${renderedPropertyName}) + "\\n" +`;
  });

  return `${renderer.renderAnnotation('Override')}
public String toString() {
  return "class ${formattedModelName} {\\n" +   
${toStringProperties.length > 0 ? renderer.indent(renderer.renderBlock(toStringProperties), 4) : ''}
  "}";
}

${renderer.renderComments(['Convert the given object to string with each line indented by 4 spaces', '(except the first line).'])}
private String toIndentedString(Object o) {
  if (o == null) {
    return "null";
  }
  return o.toString().replace("\\n", "\\n    ");
}`;
} 

/**
 * Preset which adds `equal`, `hashCode`, `toString` functions to class. 
 * 
 * @implements {JavaPreset}
 */
export const JAVA_COMMON_PRESET: JavaPreset = {
  class: {
    additionalContent({ renderer, model, content, options }) {
      options = options || {};
      const blocks: string[] = [];
      const shouldContainEqual = options.equal === undefined || options.equal === true;
      const shouldContainHashCode = options.hashCode === undefined || options.hashCode === true;
      const shouldContainToString = options.classToString === undefined || options.classToString === true;

      if (shouldContainEqual === true || shouldContainHashCode === true) {
        renderer.addDependency('import java.util.Objects;');
      }

      if (shouldContainEqual) {blocks.push(renderEqual({ renderer, model }));}
      if (shouldContainHashCode) {blocks.push(renderHashCode({ renderer, model }));}
      if (shouldContainToString) {blocks.push(renderToString({ renderer, model }));}

      return renderer.renderBlock([content, ...blocks], 2);
    },
  }
};
