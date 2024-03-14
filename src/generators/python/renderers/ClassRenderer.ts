import { PythonRenderer } from '../PythonRenderer';
import {
  ConstrainedArrayModel,
  ConstrainedDictionaryModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedReferenceModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
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

  /**
   * Return forward reference types (`Address` becomes `'Address'`) when it resolves around self-references that are
   * either a direct dependency or part of another model such as array, union, dictionary and tuple.
   *
   * Otherwise just return the provided propertyType as is.
   */
  returnPropertyType({
    model,
    property,
    propertyType
  }: {
    model: ConstrainedMetaModel;
    property: ConstrainedMetaModel;
    propertyType: string;
  }): string {
    const isSelfReference =
      property instanceof ConstrainedReferenceModel && property.ref === model;
    if (isSelfReference) {
      // Use forward references for getters and setters
      return propertyType.replace(property.ref.type, `'${property.ref.type}'`);
    } else if (property instanceof ConstrainedArrayModel) {
      return this.returnPropertyType({
        model,
        property: property.valueModel,
        propertyType
      });
    } else if (property instanceof ConstrainedTupleModel) {
      let newPropType = propertyType;
      for (const tupl of property.tuple) {
        newPropType = this.returnPropertyType({
          model,
          property: tupl.value,
          propertyType
        });
      }
      return newPropType;
    } else if (property instanceof ConstrainedUnionModel) {
      let newPropType = propertyType;
      for (const unionModel of property.union) {
        newPropType = this.returnPropertyType({
          model,
          property: unionModel,
          propertyType
        });
      }
      return newPropType;
    } else if (property instanceof ConstrainedDictionaryModel) {
      return this.returnPropertyType({
        model,
        property: property.value,
        propertyType
      });
    }
    return propertyType;
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
      const assignments = Object.values(properties).map((property) => {
        const propertyType = property.property.type;
        if (property.property.options.const) {
          return `self._${property.propertyName}: ${propertyType} = ${property.property.options.const.value}`;
        }
        let assignment: string;
        if (property.property instanceof ConstrainedReferenceModel) {
          assignment = `self._${property.propertyName}: ${propertyType} = ${propertyType}(input['${property.propertyName}'])`;
        } else {
          assignment = `self._${property.propertyName}: ${propertyType} = input['${property.propertyName}']`;
        }
        if (!property.required) {
          return `if '${property.propertyName}' in input:
${renderer.indent(assignment, 2)}`;
        }
        return assignment;
      });
      body = renderer.renderBlock(assignments);
    } else {
      body = `"""
No properties
"""`;
    }
    renderer.dependencyManager.addDependency(`from typing import Dict`);
    return `def __init__(self, input: Dict):
${renderer.indent(body, 2)}`;
  },
  getter({ property, renderer, model }) {
    const propertyType = renderer.returnPropertyType({
      model,
      property: property.property,
      propertyType: property.property.type
    });
    const propAssignment = `return self._${property.propertyName}`;
    return `@property
def ${property.propertyName}(self) -> ${propertyType}:
${renderer.indent(propAssignment, 2)}`;
  },
  setter({ property, renderer, model }) {
    // if const value exists we should not render a setter
    if (property.property.options.const?.value) {
      return '';
    }
    const propertyType = renderer.returnPropertyType({
      model,
      property: property.property,
      propertyType: property.property.type
    });

    const propAssignment = `self._${property.propertyName} = ${property.propertyName}`;
    const propArgument = `${property.propertyName}: ${propertyType}`;

    return `@${property.propertyName}.setter
def ${property.propertyName}(self, ${propArgument}):
${renderer.indent(propAssignment, 2)}`;
  }
};
