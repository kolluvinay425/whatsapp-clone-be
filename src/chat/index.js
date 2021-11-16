import server from "../server";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const chatServer = createServer(server);
const port = process.env.PORT || 3001;
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

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("database connected");
});
server.listen(port, () => {
  console.log(`running on ${port}`);
});
