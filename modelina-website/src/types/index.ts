import { ParsedUrlQuery } from 'querystring';

export interface ModelProps {
  code: string;
  name: string;
}

export interface UpdateMessage {
  models: ModelProps[];
}

export interface ModelinaTypeScriptOptions extends ModelinaGeneralOptions {
  tsMarshalling: boolean;
  tsModelType: 'class' | 'interface' | undefined;
  tsEnumType: 'union' | 'enum' | undefined;
  tsModuleSystem: 'ESM' | 'CJS' | undefined;
  tsIncludeDescriptions: boolean;
  tsIncludeJsonBinPack: boolean;
  tsIncludeExampleFunction: boolean;
}

export interface ModelinaJavaOptions extends ModelinaGeneralOptions {}
export interface ModelinaCplusplusOptions extends ModelinaGeneralOptions {}
export interface ModelinaGoOptions extends ModelinaGeneralOptions {}
export interface ModelinaJavaScriptOptions extends ModelinaGeneralOptions {}
export interface ModelinaPhpOptions extends ModelinaGeneralOptions {
  phpIncludeDescriptions: boolean;
}
export interface ModelinaCSharpOptions extends ModelinaGeneralOptions {
  csharpArrayType: 'List' | 'Array' | undefined;
  csharpAutoImplemented: boolean;
  csharpOverwriteHashcode: boolean;
  csharpIncludeJson: boolean;
  csharpOverwriteEqual: boolean;
  csharpIncludeNewtonsoft: boolean;
}
export interface ModelinaKotlinOptions extends ModelinaGeneralOptions {}
export interface ModelinaRustOptions extends ModelinaGeneralOptions {}
export interface ModelinaPythonOptions extends ModelinaGeneralOptions {}
export interface ModelinaDartOptions extends ModelinaGeneralOptions {}
export interface ModelinaGeneralOptions {
  language:
    | 'typescript'
    | 'java'
    | 'go'
    | 'javascript'
    | 'csharp'
    | 'kotlin'
    | 'rust'
    | 'python'
    | 'dart'
    | 'cplusplus'
    | 'php';
  showTypeMappingExample: boolean;
  indentationType: 
    | 'tabs'
    | 'spaces';
  propertyNamingFormat: 
    | 'default'
    | 'snake_case'
    | 'pascal_case'
    | 'camel_case'
    | 'param_case'
    | 'constant_case';
  modelNamingFormat:
    | 'default'
    | 'snake_case'
    | 'pascal_case'
    | 'camel_case'
    | 'param_case'
    | 'constant_case';
  enumKeyNamingFormat:
    | 'default'
    | 'snake_case'
    | 'pascal_case'
    | 'camel_case'
    | 'param_case'
    | 'constant_case';
}
export interface ModelinaGeneralQueryOptions {
  language: string;
  showTypeMappingExample?: string;
  indentationType?: string;
  propertyNamingFormat?: string;
  modelNamingFormat?: string;
  enumKeyNamingFormat?: string;
}

export interface ModelinaJavaQueryOptions {}
export interface ModelinaGoQueryOptions {}
export interface ModelinaJavaScriptQueryOptions {}
export interface ModelinaCSharpQueryOptions {
  csharpArrayType?: string;
  csharpAutoImplemented?: string;
  csharpOverwriteHashcode?:string;
  csharpIncludeJson?: string;
  csharpOverwriteEqual?: string;
  csharpIncludeNewtonsoft?: string;
}
export interface ModelinaKotlinQueryOptions {}
export interface ModelinaRustQueryOptions {}
export interface ModelinaPythonQueryOptions {}
export interface ModelinaCplusplusQueryOptions {}
export interface ModelinaDartQueryOptions {}
export interface ModelinaPhpQueryOptions {
  phpIncludeDescriptions?: string;
}

export interface ModelinaTypeScriptQueryOptions {
  tsMarshalling?: string;
  tsModelType?: string;
  tsEnumType?: string;
  tsIncludeDescriptions?: string;
  tsIncludeJsonBinPack?: string;
  tsIncludeExampleFunction?: string;
}

export interface ModelinaOptions
  extends ModelinaGeneralOptions,
    ModelinaTypeScriptOptions,
    ModelinaJavaOptions,
    ModelinaGoOptions,
    ModelinaJavaScriptOptions,
    ModelinaCSharpOptions,
    ModelinaKotlinOptions,
    ModelinaRustOptions,
    ModelinaPythonOptions,
    ModelinaDartOptions,
    ModelinaPhpOptions {}
export interface ModelinaQueryOptions
  extends ParsedUrlQuery,
    ModelinaGeneralQueryOptions,
    ModelinaTypeScriptQueryOptions,
    ModelinaJavaQueryOptions,
    ModelinaGoQueryOptions,
    ModelinaJavaScriptQueryOptions,
    ModelinaCSharpQueryOptions,
    ModelinaKotlinQueryOptions,
    ModelinaRustQueryOptions,
    ModelinaPythonQueryOptions,
    ModelinaCplusplusQueryOptions,
    ModelinaDartQueryOptions,
    ModelinaPhpQueryOptions {}

export interface GenerateMessage extends ModelinaOptions {
  input: string;
}
export const modelinaLanguageOptions = [
  {
    value: 'typescript',
    text: 'TypeScript'
  },
  {
    value: 'java',
    text: 'Java'
  },
  {
    value: 'go',
    text: 'Go'
  },
  {
    value: 'javascript',
    text: 'JavaScript'
  },
  {
    value: 'csharp',
    text: 'C#'
  },
  {
    value: 'kotlin',
    text: 'Kotlin'
  },
  {
    value: 'rust',
    text: 'Rust'
  },
  {
    value: 'python',
    text: 'Python'
  },
  {
    value: 'dart',
    text: 'Dart'
  },
  {
    value: 'cplusplus',
    text: 'C++'
  },
  {
    value: 'php',
    text: 'PHP'
  }
];

export const defaultAsyncapiDocument = {
  asyncapi: '2.5.0',
  info: {
    title: 'Streetlights API',
    version: '1.0.0',
    description:
      'The Smartylighting Streetlights API allows you\nto remotely manage the city lights.\n',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0'
    }
  },
  servers: {
    mosquitto: {
      url: 'mqtt://test.mosquitto.org',
      protocol: 'mqtt'
    }
  },
  channels: {
    'light/measured': {
      publish: {
        summary:
          'Inform about environmental lighting conditions for a particular streetlight.',
        operationId: 'onLightMeasured',
        message: {
          name: 'LightMeasured',
          payload: {
            type: 'object',
            $id: 'LightMeasured',
            properties: {
              id: {
                type: 'integer',
                minimum: 0,
                description: 'Id of the streetlight.'
              },
              lumens: {
                type: 'integer',
                minimum: 0,
                description: 'Light intensity measured in lumens.'
              },
              sentAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the message was sent.'
              }
            }
          }
        }
      }
    },
    'turn/on': {
      subscribe: {
        summary:
          'Command a particular streetlight to turn the lights on or off.',
        operationId: 'turnOn',
        message: {
          name: 'TurnOn',
          payload: {
            type: 'object',
            $id: 'TurnOn',
            properties: {
              id: {
                type: 'integer',
                minimum: 0,
                description: 'Id of the streetlight.'
              },
              sentAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time when the message was sent.'
              }
            }
          }
        }
      }
    }
  }
};
