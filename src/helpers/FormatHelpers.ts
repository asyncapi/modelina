/* eslint-disable no-unused-vars */
import { 
  camelCase,
  pascalCase,
  paramCase,
  constantCase,
} from 'change-case';

export enum IndentationTypes {
  TABS = 'tabs',
  SPACES = 'spaces',
}

export class FormatHelpers {
  /**
   * Upper first char in given string value.
   * @param {string} value to change
   * @returns {string}
   */
  static upperFirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /**
   * Transform into a string with the separator denoted by the next word capitalized.
   * @param {string} value to transform
   * @returns {string}
   */
  static toCamelCase = camelCase;

  /**
   * Transform into a string of capitalized words without separators.
   * @param {string} value to transform
   * @returns {string}
   */
  static toPascalCase = pascalCase;

  /**
   * Transform into a lower cased string with dashes between words.
   * @param {string} value to transform
   * @returns {string}
   */
  static toParamCase = paramCase;

  /**
   * Transform into upper case string with an underscore between words.
   * @param {string} value to transform
   * @returns {string}
   */
  static toConstantCase = constantCase;

  /**
   * Ensures breaking text into new lines according to newline char (`\n`) in text.
   * @param {(string | string[])} lines to breaks
   * @returns {string[]}
   */
  static breakLines(lines: string | string[]): string[] {
    lines = Array.isArray(lines) ? lines : [lines];
    return lines.map(line => line.split('\n')).flatMap(line => line);
  }

  /**
   * Ensures indentations are prepended to content.
   * @param {string} content to prepend the indentation.
   * @param {number} size the number of indendations to use. 1 by default
   * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
   * @returns {string}
   */
  static indent(content = '', size = 1, type: IndentationTypes = IndentationTypes.SPACES): string {
    if (size < 1) {
      return content;
    }

    // if the content includes new lines ensure that they have the added indentation as well.
    if (content.includes('\n')) {
      const newLineArray = content.split('\n');
      return newLineArray.reduce((accumulator, value) => {
        const newValue = value.trim() === '' ? value : `${this.getIndentation(size, type)}${value}`;
        return accumulator === '' ? newValue : `${accumulator}\n${newValue}`;
      }, '');
    }
    return `${this.getIndentation(size, type)}${content}`;
  }

  /**
   * Get the indendation string based on how many and which type of indentation are requested.
   * @private
   * @param {number} size the number of indendations to use
   * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
   * @returns {string}
   */
  private static getIndentation(size = 0, type: IndentationTypes = IndentationTypes.SPACES): string {
    const whitespaceChar = type === IndentationTypes.SPACES ? ' ' : '\t';
    return Array(size).fill(whitespaceChar).join('');
  }

  /**
   * Render given JSON Schema example to string
   * 
   * @param {Array<Any>} examples to render
   * @returns {string}
   */
  static renderJSONExamples(examples: any[]): string {
    let renderedExamples = '';
    if (Array.isArray(examples)) {
      for (const example of examples) {
        if (renderedExamples !== '') {renderedExamples += ', ';}
        if (typeof example === 'object') {
          try {
            renderedExamples += JSON.stringify(example);
          } catch (ignore) {
            renderedExamples += example;
          }
        } else {
          renderedExamples += example;
        }
      }
    }
    return renderedExamples;
  }
}
