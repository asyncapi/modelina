import { CSharpFileGenerator, JavaFileGenerator, JavaScriptFileGenerator, TypeScriptFileGenerator, GoFileGenerator, Logger, DartFileGenerator, PythonFileGenerator, RustFileGenerator, TS_COMMON_PRESET, TS_JSONBINPACK_PRESET, CSHARP_NEWTONSOFT_SERIALIZER_PRESET, CSHARP_COMMON_PRESET, CSHARP_JSON_SERIALIZER_PRESET, KotlinFileGenerator, TS_DESCRIPTION_PRESET, PhpFileGenerator, CplusplusFileGenerator, JAVA_CONSTRAINTS_PRESET, JAVA_JACKSON_PRESET, JAVA_COMMON_PRESET, JAVA_DESCRIPTION_PRESET, ScalaFileGenerator } from '@asyncapi/modelina';
import { Flags } from '@oclif/core';
import ModelinaCommand from '../base';

import type { AbstractGenerator, AbstractFileGenerator } from '@asyncapi/modelina';
import { readFile } from 'node:fs/promises';

enum Languages {
  typescript = 'typescript',
  csharp = 'csharp',
  golang = 'golang',
  java = 'java',
  javascript = 'javascript',
  dart = 'dart',
  python = 'python',
  rust = 'rust',
  kotlin='kotlin',
  php='php',
  cplusplus='cplusplus',
  scala='scala'
}
const possibleLanguageValues = Object.values(Languages).join(', ');

export default class Models extends ModelinaCommand {
  static description = 'Generates typed models';
  static args = [
    {
      name: 'language',
      description: 'The language you want the typed models generated for.',
      options: Object.keys(Languages),
      required: true
    },
    { 
      name: 'file', 
      description: 'Path or URL to the AsyncAPI document, or context-name', 
      required: true 
    },
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
    output: Flags.string({
      char: 'o',
      description: 'The output directory where the models should be written to. Omitting this flag will write the models to `stdout`.',
      required: false
    }),

    /**
     * TypeScript specific options
     */
    tsModelType: Flags.string({
      type: 'option',
      options: ['class', 'interface'],
      description: 'TypeScript specific, define which type of model needs to be generated.',
      required: false,
      default: 'class',
    }),
    tsEnumType: Flags.string({
      type: 'option',
      options: ['enum', 'union'],
      description: 'TypeScript specific, define which type of enums needs to be generated.',
      required: false,
      default: 'enum',
    }),
    tsModuleSystem: Flags.string({
      type: 'option',
      options: ['ESM', 'CJS'],
      description: 'TypeScript specific, define the module system to be used.',
      required: false,
      default: 'ESM',
    }),
    tsIncludeComments: Flags.boolean({
      description: 'TypeScript specific, if enabled add comments while generating models.',
      required: false,
      default: false,
    }),
    tsExportType: Flags.string({
      type: 'option',
      options: ['default', 'named'],
      description: 'TypeScript specific, define which type of export needs to be generated.',
      required: false,
      default: 'default',
    }),
    tsJsonBinPack: Flags.boolean({
      description: 'TypeScript specific, define basic support for serializing to and from binary with jsonbinpack.',
      required: false,
      default: false,
    }),
    tsMarshalling: Flags.boolean({
      description: 'TypeScript specific, generate the models with marshalling functions.',
      required: false,
      default: false,
    }),
    tsExampleInstance: Flags.boolean({
      description: 'Typescript specific, generate example of the model.',
      required: false,
      default: false,
    }),
    
    /**
     * Go and Java specific package name to use for the generated models
     */
    packageName: Flags.string({
      description: 'Go, Java and Kotlin specific, define the package to use for the generated models. This is required when language is `go`, `java` or `kotlin`.',
      required: false
    }),

    /**
     * Java specific options
     */
    javaIncludeComments: Flags.boolean({
      description: 'Java specific, if enabled add comments while generating models.',
      required: false,
      default: false
    }),
    javaJackson: Flags.boolean({
      description: 'Java specific, generate the models with Jackson serialization support',
      required: false,
      default: false
    }),
    javaConstraints: Flags.boolean({
      description: 'Java specific, generate the models with constraints',
      required: false,
      default: false
    }),

    /**
     * C++ and C# and PHP specific namespace to use for the generated models
     */
    namespace: Flags.string({
      description: 'C#, C++ and PHP specific, define the namespace to use for the generated models. This is required when language is `csharp`,`c++` or `php`.',
      required: false
    }),

    /**
     * C# specific options
     */
    csharpAutoImplement: Flags.boolean({
      description: 'C# specific, define whether to generate auto-implemented properties or not.',
      required: false,
      default: false
    }),
    csharpNewtonsoft: Flags.boolean({
      description: 'C# specific, generate the models with newtonsoft serialization support',
      required: false,
      default: false
    }),
    csharpArrayType: Flags.string({
      type: 'option',
      description: 'C# specific, define which type of array needs to be generated.',
      options: ['Array', 'List'],
      required: false,
      default: 'Array'
    }),
    csharpHashcode: Flags.boolean({
      description: 'C# specific, generate the models with the GetHashCode method overwritten',
      required: false,
      default: false
    }),
    csharpEqual: Flags.boolean({
      description: 'C# specific, generate the models with the Equal method overwritten',
      required: false,
      default: false
    }),
    csharpSystemJson: Flags.boolean({
      description: 'C# specific, generate the models with System.Text.Json serialization support',
      required: false,
      default: false
    }),
  };

  /* eslint-disable sonarjs/cognitive-complexity */
  async run() {
    const { args, flags } = await this.parse(Models);
    const { tsModelType, tsEnumType, tsIncludeComments, tsModuleSystem, tsExportType, tsJsonBinPack, tsMarshalling, tsExampleInstance, namespace, csharpAutoImplement, csharpArrayType, csharpNewtonsoft, csharpHashcode, csharpEqual, csharpSystemJson, packageName, javaIncludeComments, javaJackson, javaConstraints, output } = flags;
    const { language, file } = args;
    let document = "";
    try {
      document = await readFile(file, 'utf8');
    } catch {
      throw new Error('Unable to read input file content.');
    }

    Logger.setLogger({
      info: (message) => {
        this.log(message);
      },
      debug: (message) => {
        this.debug(message);
      },
      warn: (message) => {
        this.warn(message);
      },
      error: (message) => {
        this.error(message);
      },
    });

    let fileGenerator: AbstractGenerator<any, any> & AbstractFileGenerator<any>;
    let fileOptions: any = {};
    const presets = [];
    const options = {
      marshalling: tsMarshalling,
      example: tsExampleInstance,
    };
    switch (language) {
    case Languages.typescript: {
      presets.push({
        preset: TS_COMMON_PRESET,
        options
      });
      if (tsIncludeComments) {presets.push(TS_DESCRIPTION_PRESET);}
      if (tsJsonBinPack) {
        presets.push({
          preset: TS_COMMON_PRESET,
          options
        },
        TS_JSONBINPACK_PRESET);
      }

      fileGenerator = new TypeScriptFileGenerator({
        modelType: tsModelType as 'class' | 'interface',
        enumType: tsEnumType as 'enum' | 'union',
        presets
      });
      fileOptions = {
        moduleSystem: tsModuleSystem,
        exportType: tsExportType
      };
      break;
    }

    case Languages.python: {
      fileGenerator = new PythonFileGenerator();
      break;
    }

    case Languages.rust: {
      fileGenerator = new RustFileGenerator();
      break;
    }

    case Languages.csharp: {
      if (namespace === undefined) {
        throw new Error('In order to generate models to C#, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
      }

      if (csharpNewtonsoft) {
        presets.push(CSHARP_NEWTONSOFT_SERIALIZER_PRESET);
      }

      if (csharpSystemJson) {
        presets.push(CSHARP_JSON_SERIALIZER_PRESET);
      }

      if (csharpHashcode || csharpEqual) {
        presets.push({
          preset: CSHARP_COMMON_PRESET,
          options: {
            hashCode: csharpHashcode,
            equals: csharpEqual
          }
        });
      }

      fileGenerator = new CSharpFileGenerator({
        presets,
        collectionType: csharpArrayType as 'Array' | 'List',
        autoImplementedProperties: csharpAutoImplement
      });

      fileOptions = {
        namespace
      };
      break;
    }

    case Languages.cplusplus: {
      if (namespace === undefined) {
        throw new Error('In order to generate models to C++, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
      }

      fileGenerator = new CplusplusFileGenerator({
        namespace
      });
      break;
    }

    case Languages.scala: {
      if (packageName === undefined) {
        throw new Error('In order to generate models to Scala, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
      }

      fileGenerator = new ScalaFileGenerator();
      fileOptions = {
        packageName
      };
      break;
    }

    case Languages.golang: {
      if (packageName === undefined) {
        throw new Error('In order to generate models to Go, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
      }

      fileGenerator = new GoFileGenerator();
      fileOptions = {
        packageName
      };
      break;
    }

    case Languages.java: {
      if (packageName === undefined) {
        throw new Error('In order to generate models to Java, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
      }

      presets.push({
        preset: JAVA_COMMON_PRESET,
        options
      });
      if (javaIncludeComments) {presets.push(JAVA_DESCRIPTION_PRESET);}
      if (javaJackson) {presets.push(JAVA_JACKSON_PRESET);}
      if (javaConstraints) {presets.push(JAVA_CONSTRAINTS_PRESET);}
      fileGenerator = new JavaFileGenerator({ presets });
      fileOptions = {
        packageName
      };
      break;
    }

    case Languages.javascript: {
      fileGenerator = new JavaScriptFileGenerator();
      break;
    }

    case Languages.dart: {
      if (packageName === undefined) {
        throw new Error('In order to generate models to Dart, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
      }

      fileGenerator = new DartFileGenerator();
      fileOptions = {
        packageName
      };
      break;
    }

    case Languages.kotlin: {
      if (packageName === undefined) {
        throw new Error('In order to generate models to Kotlin, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
      }

      fileGenerator = new KotlinFileGenerator();
      fileOptions = {
        packageName
      };
      break;
    }

    case Languages.php: {
      if (namespace === undefined) {
        throw new Error('In order to generate models to PHP, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
      }

      fileGenerator = new PhpFileGenerator();
      fileOptions = {
        namespace
      };
      break;
    }

    default: {
      throw new Error(`Could not determine generator for language ${language}, are you using one of the following values ${possibleLanguageValues}?`);
    }
    }

    if (output) {
      const models = await fileGenerator.generateToFiles(
        document,
        output,
        { ...fileOptions, });
      const generatedModels = models.map((model) => { return model.modelName; });
      this.log(`Successfully generated the following models: ${generatedModels.join(', ')}`);
      return;
    }

    const models = await fileGenerator.generateCompleteModels(
      document,
      { ...fileOptions });
    const generatedModels = models.map((model) => {
      return `
## Model name: ${model.modelName}
${model.result}
`;
    });
    this.log(`Successfully generated the following models: ${generatedModels.join('\n')}`);
  }
}