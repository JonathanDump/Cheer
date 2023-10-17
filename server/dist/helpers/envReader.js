"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
function envReader(variable) {
    const result = process.env[variable];
    if (!result) {
        throw new Error("Can't find the env variable");
    }
    return result;
}
exports.default = envReader;
