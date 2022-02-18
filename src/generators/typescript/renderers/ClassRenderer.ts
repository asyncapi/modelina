import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { ClassPreset, ConstrainedMetaModel, ConstrainedObjectModel } from '../../../models';

/**
 * Renderer for TypeScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
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

    for (const [propertyName, property] of Object.entries(properties)) {
      const getter = await this.runGetterPreset(propertyName, property);
      const setter = await this.runSetterPreset(propertyName, property);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property });
  }

  runSetterPreset(propertyName: string, property: ConstrainedMetaModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) : string {
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
  getter({ renderer, model, propertyName, property }): string {
    const isRequired = model.isRequired(propertyName);
    return `get ${propertyName}()${property.type} { return this._${propertyName}; }`;
  },
  setter({ renderer, model, propertyName, property }): string {
    const isRequired = model.isRequired(propertyName);
    return `set ${propertyName}(${propertyName}${property.type}) { this._${propertyName} = ${propertyName}; }`;
  },
};
