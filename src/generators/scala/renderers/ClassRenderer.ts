import { ScalaRenderer } from '../ScalaRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { ScalaOptions } from '../ScalaGenerator';
import { ClassPresetType } from '../ScalaPreset';

function getPropertyType(property: ConstrainedObjectPropertyModel): string {
  const propertyType = property.required ? 
    property.property.type : `Option[${property.property.type}]`;

  return propertyType;
}

/**
 * Renderer for Scala's `class` type
 *
 * @extends ScalaRenderer
 */
export class ClassRenderer extends ScalaRenderer<ConstrainedObjectModel> {
  async defaultSelf(hasProperties: boolean): Promise<string> {
    return hasProperties
      ? await this.defaultWithProperties()
      : `class ${this.model.name} {}`;
  }

  private async defaultWithProperties(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    return `case class ${this.model.name}(
${this.indent(this.renderBlock(content, 2))}
)`;
  }

  async renderProperties(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const rendererProperty = await this.runPropertyPreset(property);
      content.push(rendererProperty);
    }

    return this.renderBlock(content);
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
  }
}

export const SCALA_DEFAULT_CLASS_PRESET: ClassPresetType<ScalaOptions> = {
  self({ renderer, model }) {
    const hasProperties = Object.keys(model.properties).length > 0;

    return renderer.defaultSelf(hasProperties);
  },
  property({ property }) {
    const propertyType = getPropertyType(property);

    return `${property.propertyName}: ${propertyType},`;
  }
};
