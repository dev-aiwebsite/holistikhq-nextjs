const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

// Set up Next.js
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create an HTTP server using Node's built-in 'http' module
  const server = createServer((req, res) => {
    handle(req, res); // Next.js handles the routing
  });

  // Set up Socket.IO on the same server
  const io = new Server(server);

  io.on("connection", (socket) => {
    const currentUser = socket.handshake.query;
    console.log(`${currentUser.name} is connected with id of ${socket.id}, userId: ${currentUser.userId}`);

    socket.on("message", (msg) => {
      console.log("message:", msg);
      socket.broadcast.emit("message", msg); // Broadcast to other users
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  // Listen on a port (default 3000)
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
