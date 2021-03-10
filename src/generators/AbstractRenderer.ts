import { AbstractGenerator, CommonGeneratorOptions } from './AbstractGenerator';
import { CommonModel, CommonInputModel, Preset } from '../models';
import { FormatHelpers, IndentationTypes } from '../helpers';

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<
  O extends CommonGeneratorOptions = CommonGeneratorOptions,
  G extends AbstractGenerator = AbstractGenerator,
> {
  constructor(
    readonly options: O,
    readonly generator: G,
    protected readonly presets: Array<[Preset, unknown]>,
    protected readonly model: CommonModel, 
    protected readonly inputModel: CommonInputModel,
  ) {}

  renderLine(line: string): string {
    return `${line}\n`;
  }

  renderBlock(lines: string[], newLines = 1): string {
    const n = Array(newLines).fill('\n').join('');
    return lines.filter(Boolean).join(n);
  }

  indent(
    content: string, 
    size?: number, 
    type?: IndentationTypes,
  ) {
    size = size || this.options.indentation?.size;
    type = type || this.options.indentation?.type;
    return FormatHelpers.indent(content, size, type);
  }

  nameType(name: string | undefined, model?: CommonModel): string {
    name = name || '';
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel })
      : name;
  }

  nameProperty(name: string | undefined, property?: CommonModel): string {
    name = name || '';
    return this.options?.namingConvention?.property 
      ? this.options.namingConvention.property(name, { model: this.model, inputModel: this.inputModel, property })
      : name;
  }

  async runSelfPreset(): Promise<string> {
    return this.runPreset('self');
  }

  async runAdditionalContentPreset(): Promise<string> {
    return this.runPreset('additionalContent');
  }

  async runPreset(
    functionName: string,
    params: object = {},
  ): Promise<string> {
    let content = '';
    for (const [preset, options] of this.presets) {
      if (typeof preset[String(functionName)] === 'function') {
        content = await preset[String(functionName)]({ 
          ...params, 
          renderer: this, 
          content, 
          options, 
          model: this.model, 
          inputModel: this.inputModel
        });
      }
    }
    return content;
  }
}
