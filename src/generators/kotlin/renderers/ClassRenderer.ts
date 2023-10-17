import { KotlinRenderer } from '../KotlinRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { KotlinOptions } from '../KotlinGenerator';
import { ClassPresetType } from '../KotlinPreset';

/**
 * Renderer for Kotlin's `class` type
 *
 * @extends KotlinRenderer
 */
export class ClassRenderer extends KotlinRenderer<ConstrainedObjectModel> {
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

    return `data class ${this.model.name}(
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

export const KOTLIN_DEFAULT_CLASS_PRESET: ClassPresetType<KotlinOptions> = {
  self({ renderer, model }) {
    const hasProperties = Object.keys(model.properties).length > 0;

    return renderer.defaultSelf(hasProperties);
  },
  property({ property }) {
    return `val ${property.propertyName}: ${property.property.type}${
      property.required ? '' : '? = null'
    },`;
  }
};
