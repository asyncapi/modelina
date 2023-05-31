import { ModelinaGeneralOptions } from "@/types";
import { IndentationTypes, indent } from "../Utils";

/**
 * Even if each language has their own constraints, naming formatting, is something that always remain the same
 */
export function getGeneralGeneratorCode(
  generatorOptions: ModelinaGeneralOptions,
  enumKeyConstraints: string, 
  propertyKeyConstraints: string, 
  modelNameConstraints: string): string[] {
  const optionString: string[] = [];
  const constraints = [];

  if (generatorOptions.enumKeyNamingFormat !== 'default') {
    switch (generatorOptions.enumKeyNamingFormat) {
      case 'camel_case':
        constraints.push(`enumKey: ${enumKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toCamelCase
})`);
        break;
      case 'constant_case':
        constraints.push(`enumKey: ${enumKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toConstantCase
})`);
        break;
      case 'param_case':
        constraints.push(`enumKey: ${enumKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toParamCase
})`);
        break;
      case 'pascal_case':
        constraints.push(`enumKey: ${enumKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toPascalCase
})`);
        break;
      case 'snake_case':
        constraints.push(`enumKey: ${enumKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toSnakeCase
})`);
        break;
      default:
        break;
    }
  }
  if (generatorOptions.propertyNamingFormat !== 'default') {
    switch (generatorOptions.propertyNamingFormat) {
      case 'camel_case':
        constraints.push(`propertyKey: ${propertyKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toCamelCase
})`);
        break;
      case 'constant_case':
        constraints.push(`propertyKey: ${propertyKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toConstantCase
})`);
        break;
      case 'param_case':
        constraints.push(`propertyKey: ${propertyKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toParamCase
})`);
        break;
      case 'pascal_case':
        constraints.push(`propertyKey: ${propertyKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toPascalCase
})`);
        break;
      case 'snake_case':
        constraints.push(`propertyKey: ${propertyKeyConstraints}({
  NAMING_FORMATTER: FormatHelpers.toSnakeCase
})`);
        break;
      default:
        break;
    }
  }
  if (generatorOptions.modelNamingFormat !== 'default') {
    switch (generatorOptions.modelNamingFormat) {
      case 'camel_case':
        constraints.push(`modelName: ${modelNameConstraints}({
  NAMING_FORMATTER: FormatHelpers.toCamelCase
})`);
        break;
      case 'constant_case':
        constraints.push(`modelName: ${modelNameConstraints}({
  NAMING_FORMATTER: FormatHelpers.toConstantCase
})`);
        break;
      case 'param_case':
        constraints.push(`modelName: ${modelNameConstraints}({
  NAMING_FORMATTER: FormatHelpers.toParamCase
})`);
        break;
      case 'pascal_case':
        constraints.push(`modelName: ${modelNameConstraints}({
  NAMING_FORMATTER: FormatHelpers.toPascalCase
})`);
        break;
      case 'snake_case':
        constraints.push(`modelName: ${modelNameConstraints}({
  NAMING_FORMATTER: FormatHelpers.toSnakeCase
})`);
        break;
      default:
        break;
    }
  }
  if(constraints.length > 0) {
    optionString.push(`constraints: {
${constraints.map((value) => {
  return indent(value, 2, IndentationTypes.SPACES);
}).join(',\n')}
}`); 
  }

  if (generatorOptions.indentationType) {
    switch (generatorOptions.indentationType) {
      case 'spaces':
        optionString.push(`indentation: {
  type: IndentationTypes.SPACES
}`);
        break;
      case 'tabs':
        optionString.push(`indentation: {
  type: IndentationTypes.TABS
}`);
        break;
      default:
        break;
    }
  }
  return optionString;
}

/**
 * Rendering of options are pretty generic, this function handles that rendering.
 */
export function renderGeneratorInstanceCode(optionString: string[], optionStringPresets: string[], generatorName: string) {
  const renderedPresets = optionStringPresets.map((value) => {
    return indent(value, 2, IndentationTypes.SPACES);
  }).join(', \n');
  const spacer = optionString.length > 0 ? ',' : '';
  const presetOptions =
    optionStringPresets.length > 0
      ? `${spacer}\n presets: [
${renderedPresets}
]` : '';
  let fullOptions = '';
  if (optionStringPresets.length > 0 || optionString.length > 0) {
    const renderedOptions = optionString.map((value) => {
      return indent(value, 2, IndentationTypes.SPACES);
    }).join(',\n');
    fullOptions = `{
${renderedOptions}
${presetOptions}
}`;
  }
  const generateInstanceCode = `const generator = new ${generatorName}(${fullOptions});`.replace(
    /^\s*\n/gm,
    ''
  );
  return generateInstanceCode;
}