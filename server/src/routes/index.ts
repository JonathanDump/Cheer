import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server11");
});

module.exports = router;
