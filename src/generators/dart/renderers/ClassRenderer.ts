import {DartRenderer} from '../DartRenderer';
import {CommonModel, ClassPreset, PropertyType} from '../../../models';
import {DefaultPropertyNames, FormatHelpers, getUniquePropertyName} from '../../../helpers';

/**
 * Renderer for Dart's `class` type
 *
 * @extends DartRenderer
 */
export class ClassRenderer extends DartRenderer {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset(),
    ];

    // if (this.options?.collectionType === 'List') {
    //   this.addDependency('import java.util.List;');
    // }
    // if (this.model.additionalProperties !== undefined || this.model.patternProperties !== undefined) {
    //   this.addDependency('import java.util.Map;');
    // }

    const formattedName = this.nameType(`${this.model.$id}`);
    return `class ${formattedName} {
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

    for (const [propertyName, property] of Object.entries(properties)) {
      const rendererProperty = await this.runPropertyPreset(propertyName, property);
      content.push(rendererProperty);
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const additionalProperty = await this.runPropertyPreset(propertyName, this.model.additionalProperties, PropertyType.additionalProperty);
      content.push(additionalProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runPropertyPreset(propertyName, patternModel, PropertyType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }

    return this.renderBlock(content);
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', {propertyName, property, type});
  }

  /**
   * Render all the accessors for the properties
   */

  // eslint-disable-next-line require-await
  async renderAccessors(): Promise<string> {
    const content: string[] = [];
    return this.renderBlock(content, 2);
  }

  runGetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('getter', {propertyName, property, type});
  }

  runSetterPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('setter', {propertyName, property, type});
  }
}

export const DART_DEFAULT_CLASS_PRESET: ClassPreset<ClassRenderer> = {
  self({renderer}) {
    return renderer.defaultSelf();
  },
  property({renderer, propertyName, property, type}) {
    propertyName = renderer.nameProperty(propertyName, property);
    let propertyType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      propertyType = `Map<String, ${propertyType}>`;
    }
    return `${propertyType}? ${propertyName};`;
  },
  getter({renderer, propertyName, property, type}) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const getterName = `get${FormatHelpers.toPascalCase(propertyName)}`;
    let getterType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      getterType = `Map<String, ${getterType}>`;
    }
    return `${getterType} ${getterName}() { return this.${formattedPropertyName}; }`;
  },
  setter({renderer, propertyName, property, type}) {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const setterName = FormatHelpers.toPascalCase(propertyName);
    let setterType = renderer.renderType(property);
    if (type === PropertyType.additionalProperty || type === PropertyType.patternProperties) {
      setterType = `Map<String, ${setterType}>`;
    }
    return `set${setterName}(${setterType} ${formattedPropertyName}) { this.${formattedPropertyName} = ${formattedPropertyName}; }`;
  },
  ctor({renderer,model}) {
    return `${renderer.nameType(model.$id)}();`;
  }
};
