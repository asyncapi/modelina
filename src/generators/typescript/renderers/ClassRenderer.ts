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
    // Generate exported constants for properties with const values
    const constExports = Object.values(this.model.properties)
      .map(prop => {
        const constValue = prop.property.options.const?.value;
        if (constValue !== undefined) {
          // Convert camelCase to UPPER_SNAKE_CASE (e.g., eventType -> EVENT_TYPE)
          const constName = prop.propertyName
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toUpperCase();
          return `export const ${constName} = ${constValue};`;
        }
        return null;
      })
      .filter((val): val is string => val !== null);

    const constExportsBlock = constExports.length > 0 
      ? constExports.join('\n') + '\n\n' 
      : '';

    return `${constExportsBlock}class ${this.model.name} {
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
    const assignments: string[] = [];
    const ctorProperties: string[] = [];

    for (const [propertyName, property] of Object.entries(properties)) {
      // if const value exists we should not render it in the constructor
      if (property.property.options.const) {
        continue;
      }
      assignments.push(`this._${propertyName} = input.${propertyName};`);
      ctorProperties.push(renderer.renderProperty(property).replace(';', ','));
    }

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
    return `get ${property.propertyName}(): ${property.property.options.const?.value
      ? property.property.options.const.value
      : property.property.type
      }${property.required === false ? ' | undefined' : ''} { return this._${property.propertyName
      }; }`;
  },
  setter({ property }): string {
    // if const value exists we should not render a setter
    if (property.property.options.const?.value) {
      return '';
    }

    return `set ${property.propertyName}(${property.propertyName}: ${property.property.type
      }${property.required === false ? ' | undefined' : ''}) { this._${property.propertyName
      } = ${property.propertyName}; }`;
  }
};
