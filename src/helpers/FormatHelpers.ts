export enum IndentationTypes {
  TABS = 'tabs',
  SPACES = 'spaces',
}

export class FormatHelpers {
  /**
   * Ensures formatting according to the camelcase format
   * @param {string} content to format
   * @returns {string}
   */
  static camelCase(name: string): string {
    // to implement
    return name;
  }

  /**
   * Ensures breaking text into new lines according to newline char (`\n`) in text
   * @param {(string | string[])} lines to breaks
   * @returns {string[]}
   */
  static breakLines(lines: string | string[]): string[] {
    lines = Array.isArray(lines) ? lines : [lines];
    return lines.map(line => line.split('\n')).flatMap(line => line);
  }

  /**
   * Ensures indentations are prepended to content.
   * @param {string} content to prepend the indentation
   * @param {number} size the number of indendations to use
   * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
   * @returns {string}
   */
  static indent(content: string = '', size: number, type: IndentationTypes = IndentationTypes.SPACES): string {
    if (size < 1) {
      return content;
    }

    // if the content includes new lines ensure that they have the added indentation as well.
    if (content.includes('\n')) {
      const newLineArray = content.split('\n');
      return newLineArray.reduce((accumulator, value) => {
        const newValue = value.trim() === '' ? value : `${this.getIndentation(size, type)}${value}`;
        return accumulator === "" ? newValue : `${accumulator}\n${newValue}`;
      }, "");
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
  private static getIndentation(size: number = 0, type: IndentationTypes = IndentationTypes.SPACES): string {
    const whitespaceChar = type === IndentationTypes.SPACES ? ' ' : '\t';
    return Array(size).fill(whitespaceChar).join("");
  }
}
