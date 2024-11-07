import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AuthDAO } from "../DAO/AuthDAO";

const AuthRouter = Router();
const authDAO = new AuthDAO();

// Login Route
AuthRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  try {
    const foundUser = await authDAO.findUserByUsername(username);
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.sendStatus(401); // Unauthorized

    const refreshToken = jwt.sign(
      { username: foundUser.username, id: foundUser.id, role: foundUser.role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    await authDAO.updateRefreshToken(foundUser.id, refreshToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

AuthRouter.post(
  "/logout",
  async (req: Request, res: Response): Promise<any> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    const refreshToken = cookies.jwt;
    try {
      const foundUser = await authDAO.findUserByRefreshToken(refreshToken);
      if (!foundUser) {
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.sendStatus(204);
      }

      await authDAO.clearRefreshToken(foundUser.id);

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

AuthRouter.get(
  "/refresh",
  async (req: Request, res: Response): Promise<any> => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;
    try {
      const foundUser = await authDAO.findUserByRefreshToken(refreshToken);
      if (!foundUser) return res.sendStatus(403); // Forbidden

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        (err, decoded: any) => {
          if (err || foundUser.username !== decoded.username)
            return res.sendStatus(403); // Forbidden

          const newAccessToken = jwt.sign(
            { username: decoded.username, id: decoded.id, role: decoded.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "30s" }
          );
          res.json({ accessToken: newAccessToken });
        }
      );
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

AuthRouter.post(
  "/register",
  async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    try {
      const duplicate = await authDAO.checkDuplicateUsername(username);
      if (duplicate)
        return res.status(409).json({ message: "Username already exists." }); // Conflict

      const hashedPwd = await bcrypt.hash(password, 10);
      const newUser = await authDAO.createUser(username, hashedPwd);

      const accessToken = jwt.sign(
        { username: newUser.username, id: newUser.id, role: newUser.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "30s" }
      );

      const refreshToken = jwt.sign(
        { username: newUser.username, id: newUser.id, role: newUser.role },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
      );

      await authDAO.updateRefreshToken(newUser.id, refreshToken);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        accessToken,
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export { AuthRouter };
