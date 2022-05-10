import {DartRenderer} from '../DartRenderer';
import {CommonModel, ClassPreset, PropertyType} from '../../../models';
import {DefaultPropertyNames, getUniquePropertyName} from '../../../helpers';

/**
 * Renderer for Dart's `class` type
 *
 * @extends DartRenderer
 */
export class ClassRenderer extends DartRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    const formattedName = this.nameType(`${this.model.$id}`);
    return `class ${formattedName} {
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

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runPropertyPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }

    return this.renderBlock(content);
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', {propertyName, property, type});
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

export const DART_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({renderer}) {
    return renderer.defaultSelf();
  },
  property({renderer, propertyName, property, type}) {
    propertyName = renderer.nameProperty(propertyName, property);
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Map<String, ${propertyType}>`;
    }
    return `${propertyType}? ${propertyName};`;
  },
  ctor({renderer,model}) {
    return `${renderer.nameType(model.$id)}();`;
  }
};
