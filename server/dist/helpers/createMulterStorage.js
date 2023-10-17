"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
function createMulterStorage(destination) {
    return multer_1.default.diskStorage({
        destination: destination,
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const filename = file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
            cb(null, filename);
        },
    });
}
exports.default = createMulterStorage;
