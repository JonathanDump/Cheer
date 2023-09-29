import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import passport from "passport";
import checkIfMagicLinkIsUsed from "../helpers/checkIfMagicLinkIsUsed";

const userController = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: "public/avatars",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];

    cb(null, filename);
  },
});
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

module.exports = router;
