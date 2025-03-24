import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.status(401).json({ message: "Authorization header missing" });
        return;
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        res.status(400).json({ message: "Access token is missing" });
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { username: string };
      } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
      }

      const foundUser = await userService.getUserByUsername(
        decodedToken.username
      );

      if (!foundUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      });
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Failed to retrieve user: " + (err as Error).message,
        });
    }
  }
}
