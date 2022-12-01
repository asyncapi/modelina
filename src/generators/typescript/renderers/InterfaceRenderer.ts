import { TypeScriptOptions } from '../TypeScriptGenerator';
import { TypeScriptObjectRenderer } from '../TypeScriptObjectRenderer';
import { InterfacePresetType } from '../TypeScriptPreset';
import { ConstrainedObjectPropertyModel } from '../../../models';
import { Logger } from '../../../utils';

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptObjectRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    const extendsType = this.getExtendsWithAdditionalProperties();

    return `interface ${this.model.name}${extendsType} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  renderProperty(property: ConstrainedObjectPropertyModel): string {
    if (property.propertyName === 'additionalProperties') {
      return '';
    }

    return `${property.propertyName}${property.required === false ? '?' : ''}: ${property.property.type};`;
  }

  getExtendsWithAdditionalProperties(): string {
    if (!this.options.extendInterfaceWithAdditionalProperties) {
      return '';
    }

    if (this.options.mapType === 'indexedObject') {
      Logger.error('Extending indexedObject as interface is not supported.');
      return '';
    }

    if (this.model.properties.additionalProperties === undefined) {
      return '';
    }

    const extendsType = this.model.properties.additionalProperties.property.type;
    return ` extends ${extendsType}`;
  }
}

export const TS_DEFAULT_INTERFACE_PRESET: InterfacePresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ renderer, property }) {
    return renderer.renderProperty(property);
  }
};
