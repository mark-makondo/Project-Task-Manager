import { createContext } from 'react';

import socketio from 'socket.io-client';
import { BACKEND_SERVER } from '../constants/Config.js';

export const socket = socketio.connect(BACKEND_SERVER);
export const SocketContext = createContext();

// , {
// 	// fixs the cors error for socket io
// 	transports: ['websocket'],
// }
