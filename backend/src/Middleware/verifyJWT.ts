import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.sendStatus(401); // Send Unauthorized status and terminate execution
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        res.sendStatus(403); // Send Forbidden status for invalid token and terminate
        return;
      }

      req.user = {
        username: (decoded as { username: string; id: string; role: string })
          .username,
        id: (decoded as { username: string; id: string; role: string }).id,
        role: (decoded as { username: string; id: string; role: string }).role,
      };

      next();
    }
  );
};
