
  renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model)) {
      return model.map(t => this.renderType(t)).join(' | ');
    }
    if (model.enum !== undefined) {
      return model.enum.map(value => typeof value === 'string' ? `"${value}"` : value).join(' | ');
    }
    if (model.$ref !== undefined) {
      return this.nameType(model.$ref);
    }
    if (Array.isArray(model.type)) {
      return [... new Set(model.type.map(t => this.toTsType(t, model)))].join(' | ');
    }
    return this.toTsType(model.type, model);
  }

  /**
   * JSON Schema types to TS
   * 
   * @param type 
   * @param model
   */
  toTsType(type: string | undefined, model: CommonModel): string {
    switch (type) { 
    case 'null':
      return 'null';
    case 'object':
      return 'object';
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array': {
      //Check and see if it should be rendered as tuples or array 
      if (Array.isArray(model.items)) {
        const types = model.items.map((item) => {
          return this.renderType(item);
        });
        const additionalTypes = model.additionalItems ? `, ...(${this.renderType(model.additionalItems)})[]` : '';
        return `[${types.join(', ')}${additionalTypes}]`;
      }
      const arrayType = model.items ? this.renderType(model.items) : 'unknown';
      return `Array<${arrayType}>`;
    }
    default: return 'any';
    }
  }


  normalizeKey(value: ConstrainedEnumValueModel): any {
    let key;
    switch (typeof value) {
    case 'bigint':
    case 'number': {
      key = `number_${value}`;
      break;
    }
    case 'object': {
      key = JSON.stringify(value);
      break;
    }
    default: {
      key = FormatHelpers.replaceSpecialCharacters(String(value), { exclude: [' ','_'], separator: '_' });
      //Ensure no special char can be the beginning letter 
      if (!(/^[a-zA-Z]+$/).test(key.charAt(0))) {
        key = `String_${key}`;
      }
    }
    }
    return FormatHelpers.toConstantCase(key);
  }

  normalizeValue(value: any): any {
    let normalizedValue;
    switch (typeof value) {
    case 'string':
    case 'boolean':
      normalizedValue = `"${value}"`;
      break;
    case 'bigint':
    case 'number': {
      normalizedValue = value;
      break;
    }
    case 'object': {
      normalizedValue = `'${JSON.stringify(value)}'`;
      break;
    }
    default: {
      normalizedValue = String(value);
    }
    }
    return normalizedValue;
  }


  renderEnumInline(): string {
    const enums = this.model.enum || [];
    return enums.map(t => typeof t === 'string' ? `"${t}"` : t).join(' | ');
  }