import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
  static login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    try {
      const user = await authService.validateUser(username, password);
      if (!user) {
        res.sendStatus(401);
        return;
      }

      const { refreshToken } = await authService.generateTokens(user);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  static logout: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      res.sendStatus(204);
      return;
    }

    try {
      const user = await authService.findByRefreshToken(refreshToken);
      if (user) {
        await authService.clearRefreshToken(user.id);
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  static refresh: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      res.sendStatus(401);
      return;
    }

    try {
      const user = await authService.findByRefreshToken(refreshToken);
      if (!user) {
        res.sendStatus(403);
        return;
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err, decoded: any) => {
          if (err || decoded.username !== user.username) {
            res.sendStatus(403);
            return;
          }

          const newAccessToken = jwt.sign(
            {
              username: user.username,
              id: user.id,
              role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "30s" }
          );

          res.json({ accessToken: newAccessToken });
        }
      );
    } catch (err) {
      next(err);
    }
  };

  static register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    try {
      const user = await authService.registerUser(username, password);
      const { accessToken, refreshToken } = await authService.generateTokens(user);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}