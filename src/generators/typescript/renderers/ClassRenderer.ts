import { ConstrainedObjectPropertyModel } from '../../../models';
import { TypeScriptOptions } from '../TypeScriptGenerator';
import { TypeScriptObjectRenderer } from '../TypeScriptObjectRenderer';
import { ClassPresetType } from '../TypeScriptPreset';

/**
 * Renderer for TypeScript's `class` type
 *
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptObjectRenderer {
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
    const properties = this.model.properties;
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
}

export const TS_DEFAULT_CLASS_PRESET: ClassPresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }): string {
    const properties = model.properties || {};
    const assignments = Object.keys(properties).map((propertyName) => {
      return `this._${propertyName} = input.${propertyName};`;
    });
    const ctorProperties = Object.values(properties).map((property) => {
      return renderer.renderProperty(property).replace(';', ',');
    });

    return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
${renderer.indent(renderer.renderBlock(assignments))}
}`;
  },
  property({ renderer, property }): string {
    return `private _${renderer.renderProperty(property)}`;
  },
  getter({ property }): string {
    return `get ${property.propertyName}(): ${property.property.type}${
      property.required === false ? ' | undefined' : ''
    } { return this._${property.propertyName}; }`;
  },
  setter({ property }): string {
    return `set ${property.propertyName}(${property.propertyName}: ${
      property.property.type
    }${property.required === false ? ' | undefined' : ''}) { this._${
      property.propertyName
    } = ${property.propertyName}; }`;
  }
};
