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

    const constExportsBlock = this.renderConstExports();

    return `${constExportsBlock}class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
  }

  /**
   * Generates exported constants for properties with const values.
   * Converts camelCase property names to UPPER_SNAKE_CASE.
   * e.g., eventType with const "EXAMPLE_EVENT" -> export const EVENT_TYPE = 'EXAMPLE_EVENT';
   */
  renderConstExports(): string {
    const constExports = Object.values(this.model.properties)
      .map((prop) => {
        const constValue = prop.property.options.const?.value;
        if (constValue === undefined) {
          return null;
        }
        const constName = prop.propertyName
          .replaceAll(/([a-z])([A-Z])/g, '$1_$2')
          .toUpperCase();
        // Handle different types: strings stay as-is, objects use JSON.stringify, primitives use String()
        let safeValue: string;
        if (typeof constValue === 'string') {
          safeValue = constValue;
        } else if (typeof constValue === 'object' && constValue !== null) {
          safeValue = JSON.stringify(constValue);
        } else {
          safeValue = String(constValue);
        }
        return `export const ${constName} = ${safeValue};`;
      })
      .filter((val): val is string => val !== null);

    if (constExports.length === 0) {
      return '';
    }

    return constExports.join('\n') + '\n\n';
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
      ctorProperties.push(renderer.renderProperty(property).replaceAll(';', ','));
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
    const constVal = property.property.options.const?.value;
    let returnType: string;
    if (constVal === undefined) {
      returnType = property.property.type;
    } else if (typeof constVal === 'string') {
      returnType = constVal;
    } else if (typeof constVal === 'object' && constVal !== null) {
      returnType = JSON.stringify(constVal);
    } else {
      returnType = String(constVal);
    }
    const optionalSuffix = property.required === false ? ' | undefined' : '';
    return `get ${property.propertyName}(): ${returnType}${optionalSuffix} { return this._${property.propertyName}; }`;
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
