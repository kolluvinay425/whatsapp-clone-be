/*import express from "express";
import list from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";

const server = express();

const port = process.env.PORT | 3001;
// ******************** MIDDLEWARES *************************+

server.use(cors());
server.use(express.json());
// ******************** ROUTES ******************************

// ********************** ERROR HANDLERS *************************

console.table(list(server));

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("database Connected");
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});*/
