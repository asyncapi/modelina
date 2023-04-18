import { JavaRenderer } from '../JavaRenderer';
import {
  ConstrainedDictionaryModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedUnionModel,
  UnionModel,
  InputMetaModel,
  Preset
} from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { JavaGenerator, JavaOptions } from '../JavaGenerator';
import { ClassPresetType } from '../JavaPreset';
import { JavaDependencyManager } from '../JavaDependencyManager';

/**
 * Renderer for Java's `class` type
 *
 * @extends JavaRenderer
 */
export class ClassRenderer extends JavaRenderer<ConstrainedObjectModel> {
  readonly parentUnions: ConstrainedUnionModel[];
  readonly discriminatorProperties: string[];

  constructor(
    options: JavaOptions,
    generator: JavaGenerator,
    presets: Array<[Preset, unknown]>,
    model: ConstrainedObjectModel,
    inputModel: InputMetaModel,
    public dependencyManager: JavaDependencyManager
  ) {
    super(options, generator, presets, model, inputModel, dependencyManager);

    this.parentUnions = this.findParentUnions();
    this.discriminatorProperties = this.parentUnions
      .filter((u) => u.originalInput.discriminator !== undefined)
      .map((u) => u.originalInput.discriminator);
  }

  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    if (this.options?.collectionType === 'List') {
      this.dependencyManager.addDependency('import java.util.List;');
    }
    if (this.model.containsPropertyType(ConstrainedDictionaryModel)) {
      this.dependencyManager.addDependency('import java.util.Map;');
    }

    if (this.parentUnions.length > 0) {
      const parentUnionNames = this.parentUnions.map((u) => u.name);

      return `public class ${
        this.model.name
      } implements ${parentUnionNames.join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
    }

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
      content.push(await this.runPropertyPreset(property));
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

  private findParentUnions(): ConstrainedUnionModel[] {
    const parentUnions: ConstrainedUnionModel[] = [];
    for (const model of Object.values(this.inputModel.models)) {
      if (model instanceof UnionModel) {
        // Create a ConstrainedUnionModel of all Union Models
        const unionModel = this.generator.constrainToMetaModel(
          model,
          this.options
        ) as ConstrainedUnionModel;

        // Cheeck if the current model is a child model of any of the unions
        if (
          unionModel.union.some(
            (m) => m.name === this.model.name && m.type === this.model.type
          )
        ) {
          parentUnions.push(unionModel);
        }
      }
    }
    return parentUnions;
  }
}

export const JAVA_DEFAULT_CLASS_PRESET: ClassPresetType<JavaOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  property({ property, model, renderer }) {
    if (property.property.options.const?.value) {
      return `private final ${property.property.type} ${property.propertyName} = ${property.property.options.const.value};`;
    } else if (
      renderer.discriminatorProperties.includes(
        property.unconstrainedPropertyName
      )
    ) {
      return `private ${property.property.type} ${property.propertyName} = "${model.name}";`;
    }

    return `private ${property.property.type} ${property.propertyName};`;
  },
  getter({ property }) {
    const getterName = `get${FormatHelpers.toPascalCase(
      property.propertyName
    )}`;
    return `public ${property.property.type} ${getterName}() { return this.${property.propertyName}; }`;
  },
  setter({ property }) {
    if (property.property.options.const?.value) {
      return '';
    }
    const setterName = FormatHelpers.toPascalCase(property.propertyName);
    return `public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
  }
};
