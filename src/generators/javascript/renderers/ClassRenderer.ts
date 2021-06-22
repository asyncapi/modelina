import { JavaScriptRenderer } from '../JavaScriptRenderer';

import { CommonModel, ClassPreset } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for JavaScript's `class` type
 * 
 * @extends JavaScriptRenderer
 */
export class ClassRenderer extends JavaScriptRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];
    
    const formattedName = this.model.$id && FormatHelpers.toPascalCase(this.model.$id);
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

export const JS_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    const assigments = Object.entries(properties).map(([propertyName, property]) => {
      propertyName = renderer.nameProperty(propertyName, property);
      return `this.${propertyName} = input.${propertyName};`;
    });
    const body = renderer.renderBlock(assigments);

    return `constructor(input) {
${renderer.indent(body)}
}`;
  },
  property({ renderer, propertyName, property }) {
    propertyName = renderer.nameProperty(propertyName, property);
    return `${propertyName};`;
  },
  getter({ renderer, propertyName, property }) {
    propertyName = renderer.nameProperty(propertyName, property);
    return `get ${propertyName}() { return this.${propertyName}; }`;
  },
  setter({ renderer, propertyName, property }) {
    propertyName = renderer.nameProperty(propertyName, property);
    return `set ${propertyName}(${propertyName}) { this.${propertyName} = ${propertyName}; }`;
  },
};
