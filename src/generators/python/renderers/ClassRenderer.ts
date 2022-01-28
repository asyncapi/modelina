import { PythonRenderer } from '../PythonRenderer';
import { CommonModel, ClassPreset, PropertyType } from '../../../models';
import { getUniquePropertyName, DefaultPropertyNames } from '../../../helpers';

/**
 * Renderer for Python's `class` type
 * 
 * @extends PythonRenderer
 */
export class ClassRenderer extends PythonRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];
    const formattedName = this.nameType(this.model.$id);
    return `class ${formattedName}: 
${this.indent(this.renderBlock(content))}`;
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
    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const getter = await this.runGetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      const setter = await this.runSetterPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(this.renderBlock([getter, setter]));
    }
  
    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const getter = await this.runGetterPreset(propertyName, patternModel, PropertyType.patternProperties);
        const setter = await this.runSetterPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(this.renderBlock([getter, setter]));
      }
    }
  
    return this.renderBlock(content);
  }
  
  runGetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', { propertyName, property, type });
  }
  
  runSetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', { propertyName, property, type });
  }
}
  
export const PYTHON_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({renderer, model}) {
    const properties = model.properties || {};
    const assigments = Object.entries(properties).map(([propertyName, property]) => {
      if (!model.isRequired(propertyName)) {
        propertyName = renderer.nameProperty(propertyName, property);
        return `if hasattr(input, '${propertyName}'):\n\tself._${propertyName} = input.${propertyName}`;
      }
      propertyName = renderer.nameProperty(propertyName, property);
      return `self._${propertyName} = input.${propertyName}`;
    });
    const body = renderer.renderBlock(assigments);
    return `def __init__(self, input):
${renderer.indent(body)}`;
  },
  getter({ renderer, propertyName, property }) {
    propertyName = renderer.nameProperty(propertyName, property);
    return `@property
def ${propertyName}(self):\n\treturn self._${propertyName}`;
  },
  setter({ renderer, propertyName, property }) {
    propertyName = renderer.nameProperty(propertyName, property);
    return `@${propertyName}.setter
def ${propertyName}(self, ${propertyName}):\n\tself._${propertyName} = ${propertyName}`;
  },
};
