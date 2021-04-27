import { createContext } from 'react';

import socketio from 'socket.io-client';
import { BACKEND_SERVER, SOCKET_OPTIONS } from '../constants/Config.js';

export const socket = socketio.connect(BACKEND_SERVER, SOCKET_OPTIONS);
export const SocketContext = createContext();
