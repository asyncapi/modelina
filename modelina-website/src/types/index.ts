import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { ParsedUrlQuery } from "querystring";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export enum SocketIoChannels {
  UPDATE = "update",
  GENERATE = "generate"
};

export interface ModelProps {
  code: string;
  name: string;
};

export interface SocketIoUpdateMessage {
  generatorCode: string,
  models: ModelProps[]
}

export interface ModelinaTypeScriptOptions {
  tsMarshalling: boolean;
  tsModelType: "class" | "interface" | undefined;
}
export interface ModelinaJavaOptions { }
export interface ModelinaGoOptions { }
export interface ModelinaJavaScriptOptions { }
export interface ModelinaCSharpOptions { }
export interface ModelinaKotlinOptions { }
export interface ModelinaRustOptions { }
export interface ModelinaPythonOptions { }
export interface ModelinaDartOptions { }
export interface ModelinaGeneralOptions {
  language: 'typescript' | 'java' | 'go' | 'javascript' | 'csharp' | 'kotlin' | 'rust' | 'python' | 'dart';
}
export interface ModelinaGeneralQueryOptions {
  language: string;
}

export interface ModelinaJavaQueryOptions {}
export interface ModelinaGoQueryOptions { }
export interface ModelinaJavaScriptQueryOptions { }
export interface ModelinaCSharpQueryOptions { }
export interface ModelinaKotlinQueryOptions { }
export interface ModelinaRustQueryOptions { }
export interface ModelinaPythonQueryOptions { }
export interface ModelinaDartQueryOptions { }

export interface ModelinaTypeScriptQueryOptions {
  tsMarshalling?: string;
  tsModelType?: string;
}

export interface ModelinaOptions extends 
  ModelinaGeneralOptions, 
  ModelinaTypeScriptOptions, 
  ModelinaJavaOptions, 
  ModelinaGoOptions, 
  ModelinaJavaScriptOptions, 
  ModelinaCSharpOptions, 
  ModelinaKotlinOptions, 
  ModelinaRustOptions, 
  ModelinaPythonOptions,
  ModelinaDartOptions {
}
export interface ModelinaQueryOptions extends 
  ParsedUrlQuery, 
  ModelinaGeneralQueryOptions,
  ModelinaTypeScriptQueryOptions,
  ModelinaJavaQueryOptions, 
  ModelinaGoQueryOptions, 
  ModelinaJavaScriptQueryOptions, 
  ModelinaCSharpQueryOptions, 
  ModelinaKotlinQueryOptions, 
  ModelinaRustQueryOptions, 
  ModelinaPythonQueryOptions,
  ModelinaDartQueryOptions {
}

export interface SocketIoGenerateMessage extends ModelinaOptions {
  input: string
}
export const modelinaLanguageOptions = [
  {
    "value": "typescript",
    "text": "TypeScript"
  },
  { 
    "value": "java", 
    "text": "Java" 
  },
  { 
    "value": "go", 
    "text": "Go" 
  },
  { 
    "value": "javascript", 
    "text": "JavaScript" 
  },
  { 
    "value": "csharp", 
    "text": "C#" 
  },
  { 
    "value": "kotlin", 
    "text": "Kotlin" 
  },
  { 
    "value": "rust", 
    "text": "Rust" 
  },
  { 
    "value": "python", 
    "text": "Python" 
  },
  { 
    "value": "dart", 
    "text": "Dart" 
  }
];

export const defaultAsyncapiDocument = {
  "asyncapi": "2.5.0",
  "info": {
    "title": "Streetlights API",
    "version": "1.0.0",
    "description": "The Smartylighting Streetlights API allows you\nto remotely manage the city lights.\n",
    "license": {
      "name": "Apache 2.0",
      "url": "https://www.apache.org/licenses/LICENSE-2.0"
    }
  },
  "servers": {
    "mosquitto": {
      "url": "mqtt://test.mosquitto.org",
      "protocol": "mqtt"
    }
  },
  "channels": {
    "light/measured": {
      "publish": {
        "summary": "Inform about environmental lighting conditions for a particular streetlight.",
        "operationId": "onLightMeasured",
        "message": {
          "name": "LightMeasured",
          "payload": {
            "type": "object",
            "$id": "LightMeasured",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 0,
                "description": "Id of the streetlight."
              },
              "lumens": {
                "type": "integer",
                "minimum": 0,
                "description": "Light intensity measured in lumens."
              },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time when the message was sent."
              }
            }
          }
        }
      }
    },
    "turn/on": {
      "subscribe": {
        "summary": "Command a particular streetlight to turn the lights on or off.",
        "operationId": "turnOn",
        "message": {
          "name": "TurnOn",
          "payload": {
            "type": "object",
            "$id": "TurnOn",
            "properties": {
              "id": {
                "type": "integer",
                "minimum": 0,
                "description": "Id of the streetlight."
              },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "description": "Date and time when the message was sent."
              }
            }
          }
        }
      }
    }
  }
}