import { CppRenderer } from '../CppRenderer';
import { ConstrainedDictionaryModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { CppOptions } from '../CppGenerator';
import { ClassPresetType } from '../CppPreset';

/**
 * Renderer for Cpp's `class` type
 * 
 * @extends CppRenderer
 */
export class ClassRenderer extends CppRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    return `public class ${this.model.name} {
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
}

export const CPP_DEFAULT_CLASS_PRESET: ClassPresetType<CppOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property }) {
    return `private ${property.property.type} ${property.propertyName};`;
  },
  getter({ property }) {
    const getterName = `get${FormatHelpers.toPascalCase(property.propertyName)}`;
    return `public ${property.property.type} ${getterName}() { return this.${property.propertyName}; }`;
  },
  setter({ property }) {
    const setterName = FormatHelpers.toPascalCase(property.propertyName);
    return `public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
  }
};
