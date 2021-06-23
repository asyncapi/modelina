import { AbstractGenerator, CommonGeneratorOptions } from './AbstractGenerator';
import { CommonModel, CommonInputModel, Preset } from '../models';
import { FormatHelpers, IndentationTypes } from '../helpers';

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<
  O extends CommonGeneratorOptions = CommonGeneratorOptions,
  G extends AbstractGenerator = AbstractGenerator
> {
  constructor(
    protected readonly options: O,
    readonly generator: G,
    protected readonly presets: Array<[Preset, unknown]>,
    protected readonly model: CommonModel, 
    protected readonly inputModel: CommonInputModel,
    public dependencies: string[] = []
  ) {}

  /**
   * Adds a dependency while ensuring that only one dependency is preset at a time.
   * 
   * @param dependency complete dependency string so it can be rendered as is.
   */
  addDependency(dependency: string): void {
    if (!this.dependencies.includes(dependency)) {
      this.dependencies.push(dependency);
    }
  }

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
  ): string {
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
  
  async runPreset<RT = string>(
    functionName: string,
    params: Record<string, unknown> = {},
  ): Promise<RT> {
    let content;
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
