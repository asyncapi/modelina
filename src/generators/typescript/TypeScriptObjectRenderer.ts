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

  getConstValue(property: ConstrainedObjectPropertyModel): string | undefined {
    const stringConstValue = property.getStringConstantValue();
    if (stringConstValue) {
      return `'${stringConstValue.value}'`;
    }

    const enumConstValue = property.getEnumConstantValue();
    if (enumConstValue) {
      return `${property.property.type}.${enumConstValue.key}`;
    }
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
    }: ${property.property.type}`;

    const constValue = this.getConstValue(property);

    if (constValue) {
      return `${renderedProperty} = ${constValue};`;
    }

    return `${renderedProperty};`;
  }

  runPropertyPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('property', { property });
  }
}
