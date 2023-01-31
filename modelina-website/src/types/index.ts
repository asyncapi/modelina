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
  tsModelType?: string;
  tsMarshalling?: string;
}

export interface ModelinaOptions extends ParsedUrlQuery, ModelinaTypeScriptOptions { 
  language?: string;
  input?: string;
}

export interface PostPageQuery extends ModelinaOptions {
  selectedModel?: string;
}
export interface SocketIoGenerateMessage extends ModelinaOptions {}

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