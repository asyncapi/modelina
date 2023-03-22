import { AbstractGenerator, CommonGeneratorOptions } from './AbstractGenerator';
import { ConstrainedMetaModel, InputMetaModel, Preset } from '../models';
import { FormatHelpers, IndentationTypes } from '../helpers';

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<
  O extends CommonGeneratorOptions = CommonGeneratorOptions,
  G extends AbstractGenerator<any, any> = AbstractGenerator<any, any>,
  RendererModelType extends ConstrainedMetaModel = ConstrainedMetaModel
> {
  constructor(
    protected readonly options: O,
    readonly generator: G,
    protected readonly presets: Array<[Preset, unknown]>,
    protected readonly model: RendererModelType,
    protected readonly inputModel: InputMetaModel
  ) {}

  renderLine(line: string): string {
    return `${line}\n`;
  }

  renderBlock(lines: string[], newLines = 1): string {
    const n = Array(newLines).fill('\n').join('');
    return lines.filter(Boolean).join(n);
  }

  indent(content: string, size?: number, type?: IndentationTypes): string {
    size = size || this.options.indentation?.size;
    type = type || this.options.indentation?.type;
    return FormatHelpers.indent(content, size, type);
  }

  runSelfPreset(): Promise<string> {
    return this.runPreset('self');
  }

  runAdditionalContentPreset(): Promise<string> {
    return this.runPreset('additionalContent');
  }

  async runPreset(
    functionName: string,
    params: Record<string, unknown> = {}
  ): Promise<string> {
    let content = '';
    for (const [preset, options] of this.presets) {
      if (typeof preset[String(functionName)] === 'function') {
        const presetRenderedContent: any = await preset[String(functionName)]({
          ...params,
          renderer: this,
          content,
          options,
          model: this.model,
          inputModel: this.inputModel
        });
        if (typeof presetRenderedContent === 'string') {
          content = presetRenderedContent;
        } else {
          content = '';
        }
      }
    }
    return content;
  }
}
