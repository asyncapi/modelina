import { ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel } from '../../../models';
import { TypeScriptOptions } from '../TypeScriptGenerator';
import { ClassPresetType, TestClassPresetType } from '../TypeScriptPreset';
import { TypeScriptRenderer } from '../TypeScriptRenderer';
import {renderValueFromModel} from '../presets/utils/ExampleFunction';
/**
 * Renderer for TypeScript's `class` type
 * 
 * @extends TypeScriptRenderer
 */
export class TestClassRenderer extends TypeScriptRenderer<ConstrainedObjectModel> {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runCtorPreset(),
      await this.renderAccessors(),
      await this.runAdditionalContentPreset()
    ];

    return `
describe('${this.model.name}', () => {
${this.indent(this.renderBlock(content), 2)}
});
`;
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

  runGetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('getter', { property });
  }

  runSetterPreset(property: ConstrainedObjectPropertyModel): Promise<string> {
    return this.runPreset('setter', { property });
  }
}

export const TS_DEFAULT_TEST_CLASS_PRESET: TestClassPresetType<TypeScriptOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  ctor({ }) : string { return ''; },
  property(): string { return ''; },
  getter({ property, model }): string {
    const testProperty = `${property.propertyName}_value`;
    const exampleValue = renderValueFromModel(property.property);
    return `
test('should be able to get ${property.propertyName} from ${model.name}', async () => {
  const ${testProperty} = ${exampleValue};
  const instance = new ${model.name}({
    ${property.propertyName}: ${testProperty}
  });
  expect(instance.${property.propertyName}).toEqual(${testProperty});
});`;
  },
  setter({ property, model }): string {
    const testProperty = `${property.propertyName}_value`;
    const exampleValue = renderValueFromModel(property.property);
    return `
test('should be able to set ${property.propertyName} from ${model.name}', async () => {
  const ${testProperty} = ${exampleValue};
  const instance = new ${model.name}({});
  instance.${property.propertyName} = ${testProperty};
  expect(instance.${property.propertyName}).toEqual(${testProperty});
});`;
  },
};
