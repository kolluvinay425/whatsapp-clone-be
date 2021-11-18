import express from "express";
import list from "express-list-endpoints";
import cors from "cors";
import userRouter from "./users/index.js";

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
