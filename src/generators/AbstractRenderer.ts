import { CommonGeneratorOptions } from "./AbstractGenerator";
import { FormatHelpers, IndentationTypes } from "../helpers";
import { CommonModel } from "models";

/**
 * Abstract renderer with common helper methods
 */
export abstract class AbstractRenderer<O extends CommonGeneratorOptions = CommonGeneratorOptions> {
  constructor(
    protected readonly options: O,
  ) {}

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

  isPropertyRequired(propertyName: string, model: CommonModel): boolean {
    const required = (model.originalSchema as any)?.required || [];
    return required.includes(propertyName);
  }
}