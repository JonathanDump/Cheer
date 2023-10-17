"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
async function createRandomUserName(name) {
    let userName = name.replaceAll(/[^A-Za-z0-9_]+/g, "");
    if (userName.length > 10) {
        userName = userName.slice(0, 10);
    }
    userName += randomIntFromInterval(10 ** (14 - userName.length), 10 ** (15 - userName.length));
    const user = await user_1.default.findOne({ userName });
    if (user) {
        await createRandomUserName(userName);
    }
    return userName;
}
exports.default = createRandomUserName;
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
