import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import passport from "passport";
import createMulterStorage from "../helpers/createMulterStorage";

const postController = require("../controllers/postController");
const storage = createMulterStorage("public/images");
console.log("storage", storage);

export const upload = multer({ storage: storage });

router.use("/", passport.authenticate("jwt", { session: false }));

// router.post("/home", postController.getAllPosts);

router.post(
  "/create-post",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("req", req);
    next();
  },
  upload.array("images"),
  postController.createPost
);

module.exports = router;
