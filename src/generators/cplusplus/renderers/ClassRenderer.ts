import { CplusplusRenderer } from '../CplusplusRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { CplusplusOptions } from '../CplusplusGenerator';
import { ClassPresetType } from '../CplusplusPreset';

/**
 * Renderer for Cplusplus's `class` type
 *
 * @extends CplusplusRenderer
 */
export class ClassRenderer extends CplusplusRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    return `struct ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
};`;
  }

  /**
   * Render all the properties for the class.
   */
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

export const CPLUSPLUS_DEFAULT_CLASS_PRESET: ClassPresetType<CplusplusOptions> =
  {
    self({ renderer }) {
      return renderer.defaultSelf();
    },
    property({ property }) {
      return `${property.property.type} ${property.propertyName};`;
    }
  };
