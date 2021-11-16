import express from "express";
import list from "express-list-endpoints";
import cors from "cors";
import userRouter from "./users/index.js";
import mongoose from "mongoose";
import {
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} from "./errorHandlers.js";
const server = express();

// ******************** MIDDLEWARES *************************+

server.use(cors());
server.use(express.json());
// ******************** ROUTES ******************************
server.use("/user", userRouter);
// ********************** ERROR HANDLERS *************************
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(catchAllHandler);

console.table(list(server));

//---------------------------------------socket.io-----------------------------------------------

import { createServer } from "http";
import { Server } from "socket.io";

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
// export default server;
mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("database connected");
});
server.listen(port, () => {
  console.log(`running on ${port}`);
});
