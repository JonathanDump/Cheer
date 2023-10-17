"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const passport_1 = __importDefault(require("passport"));
const checkIfMagicLinkIsUsed_1 = __importDefault(require("../helpers/checkIfMagicLinkIsUsed"));
const config_1 = require("../config/config");
const userController = require("../controllers/userController");
exports.upload = (0, multer_1.default)({ storage: config_1.storage });
router.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
router.get("/check-user-name", userController.checkUserName);
router.post("/sign-up", exports.upload.single("avatar"), userController.signUp);
router.post("/sign-up/set-user-name", exports.upload.none(), userController.setUserName);
router.post("/sign-up/google", exports.upload.none(), userController.signUpGoogle);
router.post("/log-in", exports.upload.none(), userController.logIn);
router.get("/log-in/verify", (0, checkIfMagicLinkIsUsed_1.default)(), passport_1.default.authenticate("jwt", { session: false }), userController.logInVerify);
router.use("/cheer", require("./cheer"));
module.exports = router;
