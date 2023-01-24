import { DartRenderer } from '../DartRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { ClassPresetType } from '../DartPreset';
import { DartOptions } from '../DartGenerator';

/**
 * Renderer for Dart's `class` type
 *
 * @extends DartRenderer
 */
export class ClassRenderer extends DartRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    return `class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
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

  /**
   * Render all the accessors for the properties
   */

  // eslint-disable-next-line require-await
  async renderAccessors(): Promise<string> {
    const content: string[] = [];
    return this.renderBlock(content, 2);
  }
}

export const DART_DEFAULT_CLASS_PRESET: ClassPresetType<DartOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property }) {
    return `${property.property.type}? ${property.propertyName};`;
  },
  ctor({ model }) {
    return `${model.name}();`;
  }
};
