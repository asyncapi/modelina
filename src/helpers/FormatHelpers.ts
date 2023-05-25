import {
  camelCase,
  pascalCase,
  paramCase,
  constantCase,
  snakeCase,
  pascalCaseTransformMerge
} from 'change-case';

export enum IndentationTypes {
  TABS = 'tabs',
  SPACES = 'spaces'
}

const specialCharacterReplacements = new Map<string, string>([
  [' ', 'space'],
  ['!', 'exclamation'],
  ['"', 'quotation'],
  ['#', 'hash'],
  ['$', 'dollar'],
  ['%', 'percent'],
  ['&', 'ampersand'],
  ["'", 'apostrophe'],
  ['(', 'roundleft'],
  [')', 'roundright'],
  ['*', 'asterisk'],
  ['+', 'plus'],
  [',', 'comma'],
  ['-', 'minus'],
  ['.', 'dot'],
  ['/', 'slash'],
  [':', 'colon'],
  [';', 'semicolon'],
  ['<', 'less'],
  ['=', 'equal'],
  ['>', 'greater'],
  ['?', 'question'],
  ['@', 'at'],
  ['[', 'squareleft'],
  ['\\', 'backslash'],
  [']', 'squareright'],
  ['^', 'circumflex'],
  ['_', 'underscore'],
  ['`', 'graveaccent'],
  ['{', 'curlyleft'],
  ['|', 'vertical'],
  ['}', 'curlyright'],
  ['~', 'tilde']
]);

interface ReplaceSpecialCharactersOptions {
  separator?: string;
  exclude?: string[];
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
   * Lower first char in given string value.
   * @param {string} value to change
   * @returns {string}
   */
  static lowerFirst(value: string): string {
    return value.charAt(0).toLowerCase() + value.slice(1);
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
   * Transform into a string of capitalized words without separators
   * merging numbers.
   * @param {string} value to transform
   * @returns {string}
   */
  static toPascalCaseMergingNumbers(value: string): string {
    return pascalCase(value, { transform: pascalCaseTransformMerge });
  }

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
   * Transform into lower case string with an underscore between words.
   * @param {string} value to transform
   * @returns {string}
   */
  static toSnakeCase = snakeCase;

  /**
   * Replace special characters (Not 0-9,a-z,A-Z) with character names
   * @param {string} value to transform
   * @param {ReplaceSpecialCharactersOptions} options
   * @returns {string}
   */
  static replaceSpecialCharacters(
    string: string,
    options?: ReplaceSpecialCharactersOptions
  ): string {
    const separator = options?.separator ?? '';
    return [...string].reduce((sum: string, c: string, i: number) => {
      if (options?.exclude?.includes(c)) {
        return sum + c;
      }
      const replacement = specialCharacterReplacements.get(c);
      if (replacement === undefined) {
        return sum + c;
      }
      return (
        sum +
        (sum.endsWith(separator) || sum.length === 0 ? '' : separator) +
        replacement +
        (i === string.length - 1 ? '' : separator)
      );
    }, '');
  }

  /**
   * Ensures breaking text into new lines according to newline char (`\n`) in text.
   * @param {(string | string[])} lines to breaks
   * @returns {string[]}
   */
  static breakLines(lines: string | string[]): string[] {
    lines = Array.isArray(lines) ? lines : [lines];
    return lines.map((line) => line.split('\n')).flatMap((line) => line);
  }

  /**
   * Ensures indentations are prepended to content.
   * @param {string} content to prepend the indentation.
   * @param {number} size the number of indendations to use. 1 by default
   * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
   * @returns {string}
   */
  static indent(
    content = '',
    size = 1,
    type: IndentationTypes = IndentationTypes.SPACES
  ): string {
    if (size < 1) {
      return content;
    }

    // if the content includes new lines ensure that they have the added indentation as well.
    if (content.includes('\n')) {
      const newLineArray = content.split('\n');
      return newLineArray.reduce((accumulator, value) => {
        const newValue =
          value.trim() === ''
            ? value
            : `${this.getIndentation(size, type)}${value}`;
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
  private static getIndentation(
    size = 0,
    type: IndentationTypes = IndentationTypes.SPACES
  ): string {
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
        if (renderedExamples !== '') {
          renderedExamples += ', ';
        }
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

  static snakeCase(renderName: string): string {
    return renderName
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }
}
