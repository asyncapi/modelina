import { NextApiRequest } from "next";
import { defaultAsyncapiDocument, NextApiResponseServerIO, SocketIoChannels, SocketIoGenerateMessage, SocketIoUpdateMessage } from "../../types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { decode } from "js-base64";
import { getTypeScriptGeneratorCode, getTypeScriptModels } from "@/modelina/TypeScriptGenerator";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    
    io.on("connection", (socket) => {
      socket.on(SocketIoChannels.GENERATE, async (message: SocketIoGenerateMessage) => {
        let input: object = defaultAsyncapiDocument;
        if(message.input !== undefined) {
          const inputString = decode(message.input);
          console.log(message);
          // const jsonSafe = inputString.replace(/'/g, '"');
          // const jsonEnsuredQutoation = jsonSafe.replace(/(['"])?([a-zA-Z0-9_$-]+)(['"])?:([^\/])/g, '"$2":$4');
          input = JSON.parse(inputString);
        }
        
        const language = message.language || 'typescript';
        let props: SocketIoUpdateMessage = {generatorCode: '', models: []};
        switch(language) {
          case 'typescript': 
            props.models = await getTypeScriptModels(input, message);
            props.generatorCode = getTypeScriptGeneratorCode(message);
            break;
          default:
            break;
        }
        const updateMessage: SocketIoUpdateMessage = props;
        console.log("Sending back update");
        console.log(updateMessage);
        socket.emit(SocketIoChannels.UPDATE, updateMessage);
      }); 
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};
