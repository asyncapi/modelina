import { NextApiRequest } from 'next';
import {
  defaultAsyncapiDocument,
  NextApiResponseServerIO,
  SocketIoChannels,
  SocketIoGenerateMessage,
  SocketIoUpdateMessage
} from '../../types';
import { Server as ServerIO, Socket } from 'socket.io';
import { Server as NetServer } from 'http';
import { decode } from 'js-base64';
import {
  getTypeScriptGeneratorCode,
  getTypeScriptModels
} from '@/SocketIo/TypeScriptGenerator';
import {
  getJavaScriptGeneratorCode,
  getJavaScriptModels
} from '@/SocketIo/JavaScriptGenerator';
import { getJavaGeneratorCode, getJavaModels } from '@/SocketIo/JavaGenerator';
import { getGoGeneratorCode, getGoModels } from '@/SocketIo/GoGenerator';
import { getDartGeneratorCode, getDartModels } from '@/SocketIo/DartGenerator';
import {
  getPythonGeneratorCode,
  getPythonModels
} from '@/SocketIo/PythonGenerator';
import { getRustGeneratorCode, getRustModels } from '@/SocketIo/RustGenerator';
import {
  getCSharpGeneratorCode,
  getCSharpModels
} from '@/SocketIo/CSharpGenerator';

export const config = {
  api: {
    bodyParser: false
  }
};

async function generateNewCode(
  socket: Socket,
  message: SocketIoGenerateMessage
) {
  try {
    let input: any = defaultAsyncapiDocument;
    if (message.input !== undefined) {
      const inputString = decode(message.input);
      console.log(message);
      // const jsonSafe = inputString.replace(/'/g, '"');
      // const jsonEnsuredQutoation = jsonSafe.replace(/(['"])?([a-zA-Z0-9_$-]+)(['"])?:([^\/])/g, '"$2":$4');
      input = JSON.parse(inputString);
    }

    const language = message.language || 'typescript';
    const props: SocketIoUpdateMessage = { generatorCode: '', models: [] };
    switch (language) {
      case 'typescript':
        props.models = await getTypeScriptModels(input, message);
        props.generatorCode = getTypeScriptGeneratorCode(message);
        break;
      case 'javascript':
        props.models = await getJavaScriptModels(input, message);
        props.generatorCode = getJavaScriptGeneratorCode(message);
        break;
      case 'java':
        props.models = await getJavaModels(input, message);
        props.generatorCode = getJavaGeneratorCode(message);
        break;
      case 'go':
        props.models = await getGoModels(input, message);
        props.generatorCode = getGoGeneratorCode(message);
        break;
      case 'csharp':
        props.models = await getCSharpModels(input, message);
        props.generatorCode = getCSharpGeneratorCode(message);
        break;
      case 'rust':
        props.models = await getRustModels(input, message);
        props.generatorCode = getRustGeneratorCode(message);
        break;
      case 'python':
        props.models = await getPythonModels(input, message);
        props.generatorCode = getPythonGeneratorCode(message);
        break;
      case 'dart':
        props.models = await getDartModels(input, message);
        props.generatorCode = getDartGeneratorCode(message);
        break;
      default:
        break;
    }
    const updateMessage: SocketIoUpdateMessage = props;
    socket.emit(SocketIoChannels.UPDATE, updateMessage);
  } catch (e) {
    console.error(e);
  }
}

function setupSocketIoServer(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio'
    });

    io.on('connection', (socket) => {
      socket.on(
        SocketIoChannels.GENERATE,
        async (message: SocketIoGenerateMessage) => {
          await generateNewCode(socket, message);
        }
      );
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
}

export default setupSocketIoServer;
