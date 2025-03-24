import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../models/User";

export class AuthService {
  private repo = new AuthRepository();

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.repo.findUserByUsername(username);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password || "");
    return match ? user : null;
  }

  async generateTokens(user: User) {
    const payload = { username: user.username, id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "30s",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    await this.repo.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async findByRefreshToken(token: string): Promise<User | undefined> {
    return this.repo.findUserByRefreshToken(token);
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.repo.clearRefreshToken(userId);
  }

  async registerUser(username: string, password: string): Promise<User> {
    const duplicate = await this.repo.checkDuplicateUsername(username);
    if (duplicate) throw new Error("Username already exists");

    const hashedPwd = await bcrypt.hash(password, 10);
    return this.repo.createUser(username, hashedPwd);
  }
}
