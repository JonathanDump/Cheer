"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const envReader_1 = __importDefault(require("./helpers/envReader"));
const socketHandlerUser_1 = __importDefault(require("./socket/socketHandlerUser"));
require("./strategies/jwt.js");
const indexRouter = require("./routes/index");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (0, envReader_1.default)("CORS_ORIGIN"),
    },
});
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
app.use(express_1.default.static("public"));
app.use("/avatars", express_1.default.static("avatars"));
mongoose_1.default.set("strictQuery", false);
const mongoDB = (0, envReader_1.default)("MONGO_DB_KEY");
main().catch((err) => console.log(err));
async function main() {
    await mongoose_1.default.connect(mongoDB);
}
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb" }));
app.use("/", indexRouter);
(0, socketHandlerUser_1.default)(exports.io);
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
