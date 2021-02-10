import { CommonGeneratorOptions } from "./AbstractGenerator";
import { Preset } from "../models";
import { FormatHelpers, IndentationTypes } from "../helpers";

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<O extends CommonGeneratorOptions = CommonGeneratorOptions> {
  constructor(
    protected readonly options: O,
    protected readonly presets: Array<[Preset, unknown]>,
  ) {}

  public abstract render(): string;

  protected renderLine(line: string): string {
    return `${line}\n`;
  }

  protected renderBlock(lines: string[], newLines: number = 1): string {
    const n = Array(newLines).fill('\n').join('');
    return lines.join(n);
  }

  protected indent(
    content: string, 
    size?: number, 
    type?: IndentationTypes,
  ) {
    size = size || this.options.indentation?.size;
    type = type || this.options.indentation?.type;
    return FormatHelpers.indent(content, size, type);
  }

  async runSelfPreset(params: object): Promise<string> {
    return this.runPreset("self", params);
  }

  async runPreset(
    functionName: string,
    params: object,
  ): Promise<string> {
    let content = "";
    for (const [preset, options] of this.presets) {
      if (typeof preset[functionName] === "function") {
        content = await preset[functionName]({ content, options, ...params, renderer: this });
      }
    }
    return content;
  }
}