import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import passport from "passport";
import createMulterStorage from "../helpers/createMulterStorage";

const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const storage = createMulterStorage("public/images");

export const upload = multer({ storage: storage });

router.use("/", passport.authenticate("jwt", { session: false }));

router.post(
  "/create-post",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("req", req);
    next();
  },
  upload.array("images"),
  postController.createPost
);

router.get("/get-posts", postController.getPosts);

router.delete("/:postId/delete-post", postController.deletePost);

router.get("/get-users", userController.getUsers);

router.put("/follow", userController.follow);
router.put("/unfollow", userController.unfollow);

// router.put("/toggle-follow", userController.toggleFollow);

module.exports = router;
