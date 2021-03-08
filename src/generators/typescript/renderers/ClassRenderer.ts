import { TypeScriptRenderer } from '../TypeScriptRenderer';

import { CommonModel, ClassPreset } from '../../../models';

/**
 * Renderer for TypeScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassRenderer extends TypeScriptRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    const formattedName = this.nameType(this.model.$id);
    return `class ${formattedName} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  runCtorPreset(): Promise<string> {
    return this.runPreset('ctor');
  }

  async renderAccessors(): Promise<string> {
    const properties = this.model.properties || {};
    const content: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      const getter = await this.runGetterPreset(propertyName, property);
      const setter = await this.runSetterPreset(propertyName, property);
      content.push(this.renderBlock([getter, setter]));
    }

    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('getter', { propertyName, property });
  }

  runSetterPreset(propertyName: string, property: CommonModel): Promise<string> {
    return this.runPreset('setter', { propertyName, property });
  }
}

export const TS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  async self({ renderer }) {
    return `export ${await renderer.defaultSelf()}`;
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assigments = Object.entries(properties).map(([propertyName, property]) => {
      const formattedName = renderer.nameProperty(propertyName, property);
      return `this._${formattedName} = input.${formattedName};`;
    });
    const ctorProperties = Object.entries(properties).map(([propertyName, property]) => {
      return renderer.renderProperty(propertyName, property).replace(';', ',');
    });

    return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
${renderer.indent(renderer.renderBlock(assigments))}
}`;
  },
  property({ renderer, propertyName, property }) {
    return `private _${renderer.renderProperty(propertyName, property)}`;
  },
  getter({ renderer, model, propertyName, property }) {
    const isRequired = model.isRequired(propertyName);
    const formattedName = renderer.nameProperty(propertyName, property);
    const signature = renderer.renderTypeSignature(property, { orUndefined: !isRequired });
    return `get ${formattedName}()${signature} { return this._${formattedName}; }`;
  },
  setter({ renderer, model, propertyName, property }) {
    const isRequired = model.isRequired(propertyName);
    const formattedName = renderer.nameProperty(propertyName, property);
    const signature = renderer.renderTypeSignature(property, { orUndefined: !isRequired });
    const arg = `${formattedName}${signature}`;
    return `set ${formattedName}(${arg}) { this._${formattedName} = ${formattedName}; }`;
  },
};
