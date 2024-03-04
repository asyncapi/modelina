import { PythonRenderer } from '../PythonRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { PythonOptions } from '../PythonGenerator';
import { ClassPresetType } from '../PythonPreset';

/**
 * Renderer for Python's `class` type
 *
 * @extends PythonRenderer
 */
export class ClassRenderer extends PythonRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    return `class ${this.model.name}: 
${this.indent(this.renderBlock(content, 2))}
`;
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

export const PYTHON_DEFAULT_CLASS_PRESET: ClassPresetType<PythonOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ renderer, model }) {
    const properties = model.properties || {};
    let body = '';
    if (Object.keys(properties).length > 0) {
      const assigments = Object.values(properties).map((property) => {
        if (!property.required) {
          return `if hasattr(input, '${property.propertyName}'):\n\tself._${property.propertyName} = input.${property.propertyName}`;
        }
        return `self._${property.propertyName} = input.${property.propertyName}`;
      });
      body = renderer.renderBlock(assigments);
    } else {
      body = `"""
No properties
"""`;
    }
    return `def __init__(self, input):
${renderer.indent(body)}`;
  },
  getter({ property }) {
    return `@property
def ${property.propertyName}(self):\n\treturn self._${property.propertyName}`;
  },
  setter({ property }) {
    return `@${property.propertyName}.setter
def ${property.propertyName}(self, ${property.propertyName}):\n\tself._${property.propertyName} = ${property.propertyName}`;
  }
};
