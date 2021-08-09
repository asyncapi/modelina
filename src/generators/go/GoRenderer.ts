import { AbstractRenderer } from '../AbstractRenderer';
import { GoGenerator, GoOptions } from './GoGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { DefaultPropertyNames, getUniquePropertyName } from '../../helpers';
import { FieldType } from './GoPreset';

/**
 * Common renderer for Go types
 * 
 * @extends AbstractRenderer
 */
export abstract class GoRenderer extends AbstractRenderer<GoOptions> {
  constructor(
    options: GoOptions,
    generator: GoGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel,
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  async renderFields(): Promise<string> {
    const fields = this.model.properties || {};
    const content: string[] = [];

    for (const [fieldName, field] of Object.entries(fields)) {
      const renderField = await this.runFieldPreset(fieldName, field);
      content.push(renderField);
    }

    if (this.model.additionalProperties !== undefined) {
      const propertyName = getUniquePropertyName(this.model, DefaultPropertyNames.additionalProperties);
      const additionalProperty = await this.runFieldPreset(propertyName, this.model.additionalProperties, FieldType.additionalProperty);
      content.push(additionalProperty);
    }

    if (this.model.patternProperties !== undefined) {
      for (const [pattern, patternModel] of Object.entries(this.model.patternProperties)) {
        const propertyName = getUniquePropertyName(this.model, `${pattern}${DefaultPropertyNames.patternProperties}`);
        const renderedPatternProperty = await this.runFieldPreset(propertyName, patternModel, FieldType.patternProperties);
        content.push(renderedPatternProperty);
      }
    }
    return this.renderBlock(content);
  }

  /**
   * Renders the name of a type based on provided generator option naming convention type function.
   * 
   * This is used to render names of models and then later used if that class is referenced from other models.
   * 
   * @param name 
   * @param model 
   */
  nameType(name: string | undefined, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel })
      : name || '';
  }

  /**
   * Renders the name of a field based on provided generator option naming convention field function.
   * 
   * @param fieldName 
   * @param field
   */
  nameField(fieldName: string | undefined, field?: CommonModel): string {
    return this.options?.namingConvention?.field 
      ? this.options.namingConvention.field(fieldName, { model: this.model, inputModel: this.inputModel, field })
      : fieldName || '';
  }

  runFieldPreset(fieldName: string, field: CommonModel, type: FieldType = FieldType.field): Promise<string> {
    return this.runPreset('field', { fieldName, field, type });
  }

  renderType(model: CommonModel): string {
    if (model.$ref !== undefined) {
      const formattedRef = this.nameType(model.$ref);
      return `*${formattedRef}`;
    }

    if (Array.isArray(model.type)) {
      return model.type.length > 1 ? '[]interface{}' : `[]${this.toGoType(model.type[0], model)}`;
    }

    return this.toGoType(model.type, model);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map(line => `// ${line}`).join('\n');
  }

  /* eslint-disable sonarjs/no-duplicate-string */
  toGoType(type: string | undefined, model: CommonModel): string {
    if (type === undefined) {
      return 'interface{}';
    }

    switch (type) {
    case 'string':
      return 'string';
    case 'integer':
      return 'int';
    case 'number':
      return 'float64';
    case 'boolean':
      return 'bool';
    case 'object':
      return 'interface{}';
    case 'array': {
      if (Array.isArray(model.items)) {
        return model.items.length > 1? '[]interface{}' : `[]${this.renderType(model.items[0])}`;
      }
      const arrayType = model.items ? this.renderType(model.items) : 'interface{}';
      return `[]${arrayType}`;
    }
    default: return type;
    }
  }
}
