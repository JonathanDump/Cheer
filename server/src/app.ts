import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import logger from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import envReader from "./helpers/envReader";
require("./strategies/jwt.js");
const indexRouter = require("./routes/index");

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: envReader("CORS_ORIGIN"),
  },
});

app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use("/avatars", express.static("avatars"));

mongoose.set("strictQuery", false);
const mongoDB = envReader("MONGO_DB_KEY");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/", indexRouter);

httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
