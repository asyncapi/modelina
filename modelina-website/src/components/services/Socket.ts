
import SocketIOClient from "socket.io-client";

export const socket = SocketIOClient(process.env.BASE_URL || '/', {
  path: "/api/socketio",
});