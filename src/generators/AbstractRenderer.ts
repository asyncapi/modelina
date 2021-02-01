import { CommonGeneratorOptions } from "./AbstractGenerator";
import { FormatHelpers, IndentationTypes } from "../helpers";

export abstract class AbstractRenderer<O extends CommonGeneratorOptions> {
  constructor(
    protected readonly options: O,
  ) {}

  renderBlankLines(size: number = 1): string {
    return Array(size).fill('\n').join('');
  }

  renderLine(line: string): string {
    return `${line}\n`;
  }

  renderBlock(lines: string[], newLines: number = 1): string {
    const n = Array(newLines).fill('\n').join('');
    return lines.join(n);
  }

  indent(
    content: string = '', 
    size: number = this.options.indentation.size, 
    type: IndentationTypes = this.options.indentation.type
  ) {
    return FormatHelpers.indent(content, size, type);
  }
}
