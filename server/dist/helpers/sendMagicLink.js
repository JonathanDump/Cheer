"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envReader_1 = __importDefault(require("./envReader"));
const nodemailer = require("nodemailer");
async function sendMagicLink({ token, email, }) {
    const link = `${(0, envReader_1.default)("SERVER_URL")}/log-in/verify?token=${token}`;
    const message = `<a href="${link}">Log In</a>`;
    const transporter = nodemailer.createTransport({
        host: "smtp.ukr.net",
        port: 465,
        secure: true,
        auth: {
            user: "jonathan_dump@ukr.net",
            pass: (0, envReader_1.default)("UKR_NET_PASSWORD"),
        },
    });
    const mailOptions = {
        from: "jonathan_dump@ukr.net",
        to: email,
        subject: "2FA",
        html: message,
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.default = sendMagicLink;
