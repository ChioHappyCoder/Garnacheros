import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
