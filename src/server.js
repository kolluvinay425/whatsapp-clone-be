import express from "express";
import list from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./users/index.js";
import {
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} from "./errorHandlers.js";
const server = express();

const port = process.env.PORT | 3001;
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

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("database Connected");
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
