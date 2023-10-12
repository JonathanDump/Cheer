import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import passport from "passport";
import { storage } from "../config/config";

const postController = require("../controllers/postController");
const userController = require("../controllers/userController");
const commentController = require("../controllers/commentsController");

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
router.post("/create-comment", upload.none(), commentController.createComment);

router.get("/get-post", postController.getPost);
router.get("/get-posts", postController.getPosts);
router.get("/get-user-posts", postController.getUserPosts);

router.get("/get-comments", commentController.getComments);

router.get("/get-users", userController.getUsers);
router.get("/get-user", userController.getUser);

router.get("/get-followers", userController.getFollowers);
router.get("/get-following", userController.getFollowing);

router.put("/follow", userController.follow);
router.put("/unfollow", userController.unfollow);

router.put("/post-set-like", postController.setLike);
router.put("/post-remove-like", postController.removeLike);

router.put("/comment-set-like", commentController.setLike);
router.put("/comment-remove-like", commentController.removeLike);

router.put("/edit-user", upload.single("avatar"), userController.editUser);

router.delete("/:postId/delete-post", postController.deletePost);
router.delete("/:commentId/delete-comment", commentController.deleteComment);

module.exports = router;
