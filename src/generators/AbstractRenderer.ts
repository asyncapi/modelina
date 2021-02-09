import { CommonGeneratorOptions } from "./AbstractGenerator";
import { FormatHelpers, IndentationTypes } from "../helpers";

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<O extends CommonGeneratorOptions = CommonGeneratorOptions> {
  constructor(
    protected readonly options: O,
  ) {}

  public abstract render(): string;

  renderLine(line: string): string {
    return `${line}\n`;
  }

  renderBlock(lines: string[], newLines: number = 1): string {
    const n = Array(newLines).fill('\n').join('');
    return lines.join(n);
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
}