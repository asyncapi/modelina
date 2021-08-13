import { TypeScriptRenderer } from '../TypeScriptRenderer';
import { CommonModel, ClassPreset } from '../../../models';

/**
 * Renderer for TypeScript's `example` type
 * 
 * @extends TypeScriptRenderer
 */
export class ClassExampleRenderer extends TypeScriptRenderer {
  public async defaultSelf(): Promise<string> {
    const content = [
      await this.renderProperties(),
      await this.runAdditionalContentPreset()
    ];

    const formattedName = this.nameType(this.model.$id);
    return `const example${formattedName} = new ${formattedName}();
    ${content}`;
  }

  /**
   * LAZY implementation, find first acceptable value
   * 
   * @param model 
   */
  renderValueFromModel(model: CommonModel) : string | undefined {
    if (model.enum !== undefined) {
      return model.enum.map(value => typeof value === 'string' ? `"${value}"` : value).join(' | ');
    }
    if (model.$ref !== undefined) {
      return this.nameType(model.$ref);
    }
    if (Array.isArray(model.type)) {
      return this.renderValueFromType(model.type[0], model);
    }
    return this.renderValueFromType(model.type, model);
  }

  renderValueFromType(modelType: string | undefined, model: CommonModel) : string | undefined {
    if (modelType === undefined) {
      return undefined;
    }
    switch (modelType) { 
    case 'string':
      return '"string"';
    case 'integer':
    case 'number':
      return '0';
    case 'boolean':
      return 'true';
    case 'array': {
      if (model.items === undefined) {
        return undefined;
      }
      //Check and see if it should be rendered as tuples 
      if (Array.isArray(model.items)) {
        const arrayValues = model.items.map((item) => {
          return this.renderValueFromModel(item);
        });
        return `[${arrayValues.join(', ')}]`;
      } 
      const arrayType = this.renderType(model.items);
      return `Array<${arrayType}>`;
    }
    }
    return undefined;
  }
}
export const TS_DEFAULT_EXAMPLE_CLASS_PRESET: ClassPreset<ClassExampleRenderer> = {
  property({ renderer, propertyName, property, model }): string {
    const formattedPropertyName = renderer.nameProperty(propertyName, property);
    const formattedName = renderer.nameType(model.$id);
    const potentialRenderedValue = renderer.renderValueFromModel(property);
    if (potentialRenderedValue === undefined) { 
      return ''; 
    }
    return `example${formattedName}.${formattedPropertyName} = ${potentialRenderedValue}`;
  }
};
