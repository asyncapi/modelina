import { AbstractFileGenerator, AbstractGenerator, Logger } from "@asyncapi/modelina";
import { TypeScriptOclifFlags, buildTypeScriptGenerator } from "./typescript";
import { CplusplusOclifFlags, buildCplusplusGenerator } from "./csplusplus";
import { CSharpOclifFlags, buildCSharpGenerator } from "./csharp";
import { DartOclifFlags, buildDartGenerator } from "./dart";
import { GoOclifFlags, buildGoGenerator } from "./go";
import { JavaOclifFlags, buildJavaGenerator } from "./java";
import { JavaScriptOclifFlags, buildJavaScriptGenerator } from "./javascript";
import { KotlinOclifFlags, buildKotlinGenerator } from "./kotlin";
import { PhpOclifFlags, buildPhpGenerator } from "./php";
import { PythonOclifFlags, buildPythonGenerator } from "./python";
import { RustOclifFlags, buildRustGenerator } from "./rust";
import { ScalaOclifFlags, buildScalaGenerator } from "./scala";
import { Args, Flags } from "@oclif/core";

export interface BuilderReturnType {
  fileOptions: any,
  fileGenerator: AbstractGenerator<any, any> & AbstractFileGenerator<any>
}

export enum Languages {
  typescript = 'typescript',
  csharp = 'csharp',
  golang = 'golang',
  java = 'java',
  javascript = 'javascript',
  dart = 'dart',
  python = 'python',
  rust = 'rust',
  kotlin = 'kotlin',
  php = 'php',
  cplusplus = 'cplusplus',
  scala = 'scala'
}
const possibleLanguageValues = Object.values(Languages).join(', ');

const buildMapper: { [key in Languages]: (flags: any) => BuilderReturnType } = {
  typescript: buildTypeScriptGenerator,
  cplusplus: buildCplusplusGenerator,
  csharp: buildCSharpGenerator,
  dart: buildDartGenerator,
  golang: buildGoGenerator,
  java: buildJavaGenerator,
  javascript: buildJavaScriptGenerator,
  kotlin: buildKotlinGenerator,
  php: buildPhpGenerator,
  python: buildPythonGenerator,
  rust: buildRustGenerator,
  scala: buildScalaGenerator,
}

export const ModelinaArgs = {
  language: Args.string({ description: 'The language you want the typed models generated for.', options: Object.keys(Languages), required: true }),
  file: Args.string({ description: 'Path or URL to the AsyncAPI document, or context-name', required: true }),
};
export const ModelinaFlags = {
  help: Flags.help({ char: 'h' }),
  output: Flags.string({
    char: 'o',
    description: 'The output directory where the models should be written to. Omitting this flag will write the models to `stdout`.',
    required: false
  }),
  /**
   * Go and Java specific package name to use for the generated models
   */
  packageName: Flags.string({
    description: 'Go, Java and Kotlin specific, define the package to use for the generated models. This is required when language is `go`, `java` or `kotlin`.',
    required: false
  }),

  /**
   * C++ and C# and PHP specific namespace to use for the generated models
   */
  namespace: Flags.string({
    description: 'C#, C++ and PHP specific, define the namespace to use for the generated models. This is required when language is `csharp`,`c++` or `php`.',
    required: false
  }),
  ...TypeScriptOclifFlags,
  ...CSharpOclifFlags,
  ...CplusplusOclifFlags,
  ...DartOclifFlags,
  ...GoOclifFlags,
  ...JavaOclifFlags,
  ...JavaScriptOclifFlags,
  ...KotlinOclifFlags,
  ...PhpOclifFlags,
  ...PythonOclifFlags,
  ...RustOclifFlags,
  ...ScalaOclifFlags,
};

/**
 * Function for generating models from the CLI arguments, flags and inputs
 * 
 * @param flags 
 * @param document 
 * @param logger 
 * @param language 
 * @returns 
 */
export async function generateModels(flags: any, document: any, logger: any, language: Languages) {
  const { output } = flags;
  Logger.setLogger(logger);
  // eslint-disable-next-line security/detect-object-injection
  const mapper = buildMapper[language]
  if (!mapper) {
    throw new Error(`Could not determine generator for language ${language}, are you using one of the following values ${possibleLanguageValues}?`);
  }

  const { fileGenerator, fileOptions } = mapper(flags);

  if (output) {
    const models = await fileGenerator.generateToFiles(
      document,
      output,
      { ...fileOptions, });
    return models;
  }

  const models = await fileGenerator.generateCompleteModels(
    document,
    { ...fileOptions });
  return models;
}