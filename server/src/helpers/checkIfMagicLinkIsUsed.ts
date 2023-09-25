import { NextFunction, Request, Response } from "express";
import { isMagicLinkUsed } from "../controllers/userController";

export default function checkIfMagicLinkIsUsed() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isMagicLinkUsed) {
      res.send("Sorry, link is not working anymore");
    } else {
      next();
    }
  };
}
