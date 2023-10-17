"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envReader_1 = __importDefault(require("./envReader"));
async function generateJwtToken(payload, expiresIn = "100d") {
    const opts = {};
    opts.expiresIn = expiresIn;
    const secret = (0, envReader_1.default)("JWT_SECRET_KEY");
    const token = await jsonwebtoken_1.default.sign({ ...payload }, secret, opts);
    return token;
}
exports.default = generateJwtToken;
