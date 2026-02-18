import { TypeScriptRenderer } from '../TypeScriptRenderer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel
} from '../../../models';
import { ConstValuePresetType } from '../TypeScriptPreset';
import { TypeScriptOptions } from '../TypeScriptGenerator';

/**
 * Renderer for TypeScript's exported const values
 *
 * This renderer generates exported const declarations for properties
 * that have const values defined in the schema.
 *
 * @extends TypeScriptRenderer
 */
export class ConstValueRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
  async defaultSelf(): Promise<string> {
    const content = [
      await this.renderItems(),
      await this.runAdditionalContentPreset()
    ];

    return this.renderBlock(content);
  }

  /**
   * Get all properties that have const values defined
   */
  getConstProperties(): ConstrainedObjectPropertyModel[] {
    return Object.values(this.model.properties).filter(
      (prop) => prop.property.options.const?.value !== undefined
    );
  }

  /**
   * Converts a property name from camelCase to UPPER_SNAKE_CASE
   */
  toConstName(propertyName: string): string {
    return propertyName.replaceAll(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  }

  async renderItems(): Promise<string> {
    const constProperties = this.getConstProperties();
    const items: string[] = [];

    for (const property of constProperties) {
      const renderedItem = await this.runItemPreset(property);
      if (renderedItem) {
        items.push(renderedItem);
      }
    }

    return this.renderBlock(items);
  }

  runItemPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('item', { property });
  }
}

export const TS_DEFAULT_CONST_VALUE_PRESET: ConstValuePresetType<TypeScriptOptions> =
  {
    self({ renderer }) {
      return renderer.defaultSelf();
    },
    item({ property, renderer }): string {
      const constValue = property.property.options.const?.value;
      if (constValue === undefined) {
        return '';
      }

      const constName = renderer.toConstName(property.propertyName);
      // Use proper formatting based on value type
      const formattedValue =
        typeof constValue === 'string' ? constValue : JSON.stringify(constValue);

      return `export const ${constName} = ${formattedValue};`;
    }
  };
