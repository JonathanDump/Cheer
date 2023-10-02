import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import passport from "passport";
import checkIfMagicLinkIsUsed from "../helpers/checkIfMagicLinkIsUsed";
import createMulterStorage from "../helpers/createMulterStorage";

const userController = require("../controllers/userController");

const storage = createMulterStorage("public/avatars");
export const upload = multer({ storage: storage });

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
router.post("/check-user-name", userController.checkUserName);

router.post("/sign-up", upload.single("avatar"), userController.signUp);
router.post(
  "/sign-up/set-user-name",
  upload.none(),
  userController.setUserName
);
router.post("/sign-up/google", upload.none(), userController.signUpGoogle);

router.post("/log-in", upload.none(), userController.logIn);
router.get(
  "/log-in/verify",
  checkIfMagicLinkIsUsed(),
  passport.authenticate("jwt", { session: false }),
  userController.logInVerify
);

router.use("/cheer", require("./cheer"));

module.exports = router;
