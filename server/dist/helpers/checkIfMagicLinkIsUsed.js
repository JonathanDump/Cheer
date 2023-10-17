"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
function checkIfMagicLinkIsUsed() {
    return (req, res, next) => {
        if (userController_1.isMagicLinkUsed) {
            res.send("Sorry, link is not working anymore");
        }
        else {
            next();
        }
    };
}
exports.default = checkIfMagicLinkIsUsed;
