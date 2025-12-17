import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// 🔥 INIT SOCKET.IO
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
