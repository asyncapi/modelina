import { TypeScriptGenerator, TypeScriptOptions } from './TypeScriptGenerator';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  InputMetaModel,
  Preset
} from '../../models';
import { TypeScriptRenderer } from './TypeScriptRenderer';
import { TypeScriptDependencyManager } from './TypeScriptDependencyManager';

/**
 * Common renderer for TypeScript types
 *
 * @extends AbstractRenderer
 */
export abstract class TypeScriptObjectRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
  constructor(
    options: TypeScriptOptions,
    generator: TypeScriptGenerator,
    presets: Array<[Preset, unknown]>,
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    dependencyManager: TypeScriptDependencyManager
  ) {
    super(options, generator, presets, model, inputModel, dependencyManager);
  }

  /**
   * Render all the properties for the model by calling the property preset per property.
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

  renderProperty(property: ConstrainedObjectPropertyModel): string {
    const renderedProperty = `${property.propertyName}${
      property.required === false ? '?' : ''
    }`;

    if (property.property.options.const?.value) {
      return `${renderedProperty}: ${property.property.options.const.value}${
        this.options.modelType === 'class'
          ? ` = ${property.property.options.const.value}`
          : ''
      };`;
    }

    return `${renderedProperty}: ${property.property.type};`;
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
  }
}
