import { JavaScriptRenderer } from '../JavaScriptRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { JavaScriptOptions } from '../JavaScriptGenerator';
import { ClassPresetType } from '../JavaScriptPreset';

/**
 * Renderer for JavaScript's `class` type
 *
 * @extends JavaScriptRenderer
 */
export class ClassRenderer extends JavaScriptRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
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

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const property of Object.values(properties)) {
      const getter = await this.runGetterPreset(property);
      const setter = await this.runSetterPreset(property);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', { property });
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

export const JS_DEFAULT_CLASS_PRESET: ClassPresetType<JavaScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assignments = Object.entries(properties).map(
      ([propertyName, property]) => {
        if (!property.required) {
          return `if (input.hasOwnProperty('${propertyName}')) {
  this.${propertyName} = input.${propertyName};
}`;
        }
        return `this.${propertyName} = input.${propertyName};`;
      }
    );
    const body = renderer.renderBlock(assignments);

    return `constructor(input) {
${renderer.indent(body)}
}`;
  },
  property({ property }) {
    return `${property.propertyName};`;
  },
  getter({ property }) {
    return `get ${property.propertyName}() { return this.${property.propertyName}; }`;
  },
  setter({ property }) {
    return `set ${property.propertyName}(${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
  }
};
