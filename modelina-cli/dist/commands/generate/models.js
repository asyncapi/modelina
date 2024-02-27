"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const modelina_1 = require("@asyncapi/modelina");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../base"));
const SpecificationFile_1 = require("../../models/SpecificationFile");
var Languages;
(function (Languages) {
    Languages["typescript"] = "typescript";
    Languages["csharp"] = "csharp";
    Languages["golang"] = "golang";
    Languages["java"] = "java";
    Languages["javascript"] = "javascript";
    Languages["dart"] = "dart";
    Languages["python"] = "python";
    Languages["rust"] = "rust";
    Languages["kotlin"] = "kotlin";
    Languages["php"] = "php";
    Languages["cplusplus"] = "cplusplus";
    Languages["scala"] = "scala";
})(Languages || (Languages = {}));
const possibleLanguageValues = Object.values(Languages).join(', ');
class Models extends base_1.default {
    static description = 'Generates typed models';
    static args = [
        {
            name: 'language',
            description: 'The language you want the typed models generated for.',
            options: Object.keys(Languages),
            required: true
        },
        { name: 'file', description: 'Path or URL to the AsyncAPI document, or context-name', required: true },
    ];
    static flags = {
        help: core_1.Flags.help({ char: 'h' }),
        output: core_1.Flags.string({
            char: 'o',
            description: 'The output directory where the models should be written to. Omitting this flag will write the models to `stdout`.',
            required: false
        }),
        /**
         * TypeScript specific options
         */
        tsModelType: core_1.Flags.string({
            type: 'option',
            options: ['class', 'interface'],
            description: 'TypeScript specific, define which type of model needs to be generated.',
            required: false,
            default: 'class',
        }),
        tsEnumType: core_1.Flags.string({
            type: 'option',
            options: ['enum', 'union'],
            description: 'TypeScript specific, define which type of enums needs to be generated.',
            required: false,
            default: 'enum',
        }),
        tsModuleSystem: core_1.Flags.string({
            type: 'option',
            options: ['ESM', 'CJS'],
            description: 'TypeScript specific, define the module system to be used.',
            required: false,
            default: 'ESM',
        }),
        tsIncludeComments: core_1.Flags.boolean({
            description: 'TypeScript specific, if enabled add comments while generating models.',
            required: false,
            default: false,
        }),
        tsExportType: core_1.Flags.string({
            type: 'option',
            options: ['default', 'named'],
            description: 'TypeScript specific, define which type of export needs to be generated.',
            required: false,
            default: 'default',
        }),
        tsJsonBinPack: core_1.Flags.boolean({
            description: 'TypeScript specific, define basic support for serializing to and from binary with jsonbinpack.',
            required: false,
            default: false,
        }),
        tsMarshalling: core_1.Flags.boolean({
            description: 'TypeScript specific, generate the models with marshalling functions.',
            required: false,
            default: false,
        }),
        tsExampleInstance: core_1.Flags.boolean({
            description: 'Typescript specific, generate example of the model',
            required: false,
            default: false,
        }),
        /**
         * Go and Java specific package name to use for the generated models
         */
        packageName: core_1.Flags.string({
            description: 'Go, Java and Kotlin specific, define the package to use for the generated models. This is required when language is `go`, `java` or `kotlin`.',
            required: false
        }),
        /**
         * Java specific options
         */
        javaIncludeComments: core_1.Flags.boolean({
            description: 'Java specific, if enabled add comments while generating models.',
            required: false,
            default: false
        }),
        javaJackson: core_1.Flags.boolean({
            description: 'Java specific, generate the models with Jackson serialization support',
            required: false,
            default: false
        }),
        javaConstraints: core_1.Flags.boolean({
            description: 'Java specific, generate the models with constraints',
            required: false,
            default: false
        }),
        /**
         * C++ and C# and PHP specific namespace to use for the generated models
         */
        namespace: core_1.Flags.string({
            description: 'C#, C++ and PHP specific, define the namespace to use for the generated models. This is required when language is `csharp`,`c++` or `php`.',
            required: false
        }),
        /**
         * C# specific options
         */
        csharpAutoImplement: core_1.Flags.boolean({
            description: 'C# specific, define whether to generate auto-implemented properties or not.',
            required: false,
            default: false
        }),
        csharpNewtonsoft: core_1.Flags.boolean({
            description: 'C# specific, generate the models with newtonsoft serialization support',
            required: false,
            default: false
        }),
        csharpArrayType: core_1.Flags.string({
            type: 'option',
            description: 'C# specific, define which type of array needs to be generated.',
            options: ['Array', 'List'],
            required: false,
            default: 'Array'
        }),
        csharpHashcode: core_1.Flags.boolean({
            description: 'C# specific, generate the models with the GetHashCode method overwritten',
            required: false,
            default: false
        }),
        csharpEqual: core_1.Flags.boolean({
            description: 'C# specific, generate the models with the Equal method overwritten',
            required: false,
            default: false
        }),
        csharpSystemJson: core_1.Flags.boolean({
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
        const inputFile = (await (0, SpecificationFile_1.load)(file)) || (await (0, SpecificationFile_1.load)());
        modelina_1.Logger.setLogger({
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
        let fileGenerator;
        let fileOptions = {};
        const presets = [];
        const options = {
            marshalling: tsMarshalling,
            example: tsExampleInstance,
        };
        switch (language) {
            case Languages.typescript:
                presets.push({
                    preset: modelina_1.TS_COMMON_PRESET,
                    options
                });
                if (tsIncludeComments) {
                    presets.push(modelina_1.TS_DESCRIPTION_PRESET);
                }
                if (tsJsonBinPack) {
                    presets.push({
                        preset: modelina_1.TS_COMMON_PRESET,
                        options
                    }, modelina_1.TS_JSONBINPACK_PRESET);
                }
                fileGenerator = new modelina_1.TypeScriptFileGenerator({
                    modelType: tsModelType,
                    enumType: tsEnumType,
                    presets
                });
                fileOptions = {
                    moduleSystem: tsModuleSystem,
                    exportType: tsExportType
                };
                break;
            case Languages.python:
                fileGenerator = new modelina_1.PythonFileGenerator();
                break;
            case Languages.rust:
                fileGenerator = new modelina_1.RustFileGenerator();
                break;
            case Languages.csharp:
                if (namespace === undefined) {
                    throw new Error('In order to generate models to C#, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
                }
                if (csharpNewtonsoft) {
                    presets.push(modelina_1.CSHARP_NEWTONSOFT_SERIALIZER_PRESET);
                }
                if (csharpSystemJson) {
                    presets.push(modelina_1.CSHARP_JSON_SERIALIZER_PRESET);
                }
                if (csharpHashcode || csharpEqual) {
                    presets.push({
                        preset: modelina_1.CSHARP_COMMON_PRESET,
                        options: {
                            hashCode: csharpHashcode,
                            equals: csharpEqual
                        }
                    });
                }
                fileGenerator = new modelina_1.CSharpFileGenerator({
                    presets,
                    collectionType: csharpArrayType,
                    autoImplementedProperties: csharpAutoImplement
                });
                fileOptions = {
                    namespace
                };
                break;
            case Languages.cplusplus:
                if (namespace === undefined) {
                    throw new Error('In order to generate models to C++, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
                }
                fileGenerator = new modelina_1.CplusplusFileGenerator({
                    namespace
                });
                break;
            case Languages.scala:
                if (packageName === undefined) {
                    throw new Error('In order to generate models to Scala, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                }
                fileGenerator = new modelina_1.ScalaFileGenerator();
                fileOptions = {
                    packageName
                };
                break;
            case Languages.golang:
                if (packageName === undefined) {
                    throw new Error('In order to generate models to Go, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                }
                fileGenerator = new modelina_1.GoFileGenerator();
                fileOptions = {
                    packageName
                };
                break;
            case Languages.java:
                if (packageName === undefined) {
                    throw new Error('In order to generate models to Java, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                }
                presets.push({
                    preset: modelina_1.JAVA_COMMON_PRESET,
                    options
                });
                if (javaIncludeComments) {
                    presets.push(modelina_1.JAVA_DESCRIPTION_PRESET);
                }
                if (javaJackson) {
                    presets.push(modelina_1.JAVA_JACKSON_PRESET);
                }
                if (javaConstraints) {
                    presets.push(modelina_1.JAVA_CONSTRAINTS_PRESET);
                }
                fileGenerator = new modelina_1.JavaFileGenerator({ presets });
                fileOptions = {
                    packageName
                };
                break;
            case Languages.javascript:
                fileGenerator = new modelina_1.JavaScriptFileGenerator();
                break;
            case Languages.dart:
                if (packageName === undefined) {
                    throw new Error('In order to generate models to Dart, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                }
                fileGenerator = new modelina_1.DartFileGenerator();
                fileOptions = {
                    packageName
                };
                break;
            case Languages.kotlin:
                if (packageName === undefined) {
                    throw new Error('In order to generate models to Kotlin, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                }
                fileGenerator = new modelina_1.KotlinFileGenerator();
                fileOptions = {
                    packageName
                };
                break;
            case Languages.php:
                if (namespace === undefined) {
                    throw new Error('In order to generate models to PHP, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
                }
                fileGenerator = new modelina_1.PhpFileGenerator();
                fileOptions = {
                    namespace
                };
                break;
            default:
                throw new Error(`Could not determine generator for language ${language}, are you using one of the following values ${possibleLanguageValues}?`);
        }
        if (output) {
            const models = await fileGenerator.generateToFiles(document, output, { ...fileOptions, });
            const generatedModels = models.map((model) => { return model.modelName; });
            this.log(`Successfully generated the following models: ${generatedModels.join(', ')}`);
            return;
        }
        const models = await fileGenerator.generateCompleteModels(document, { ...fileOptions });
        const generatedModels = models.map((model) => {
            return `
## Model name: ${model.modelName}
${model.result}
`;
        });
        this.log(`Successfully generated the following models: ${generatedModels.join('\n')}`);
    }
}
exports.default = Models;
