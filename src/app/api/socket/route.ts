// import { Server as SocketServer, Socket } from 'socket.io';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { Server as HTTPServer } from 'http';

// type NextApiResponseWithSocket = NextApiResponse & {
//   socket: {
//     server: HTTPServer & {
//       io?: SocketServer;
//     };
//   };
// };

// export async function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//   console.log('Socket API GET Request:', req.url);
  
//   // Initialize Socket.IO server only once
//   if (!res.socket.server.io) {
//     console.log('Initializing Socket.IO server...');
//     const io = new SocketServer(res.socket.server, {
//       path: '/api/socket', // Make sure path matches your route
//     });

//     res.socket.server.io = io;

//     // Listen for client connections
//     io.on('connection', (socket: Socket) => {
//       console.log('A client connected:', socket.id);

//       socket.on('message', (msg: string) => {
//         console.log('Received message:', msg);
//         socket.broadcast.emit('message', msg); // Broadcast message to other clients
//       });

//       socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//       });
//     });
//   }

//   res.end();
// }
