import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { verifyJWT } from "../Middleware/verifyJWT";
import { UserDAO } from "../DAO/UserDAO";

const UserRouter = Router();
const userDAO = new UserDAO();

UserRouter.get(
  "/profile",
  verifyJWT,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is missing" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { username: string };
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const foundUser = await userDAO.findUserByUsername(decodedToken.username);

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to retrieve user: " + err.message });
    }
  }
);

export { UserRouter };
