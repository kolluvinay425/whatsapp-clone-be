import { server } from "../../server.js";
import { createServer } from "http";
import { Server } from "socket.io";

const chatServer = createServer(server);

const io = new Server(chatServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId, username) => {
    socket.join(roomId);
    console.log(`userName with ${username} joined room:${roomId}`);
  });
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log("message:", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// server.listen(port, () => {
//   console.log(`running on ${port}`);
// });
