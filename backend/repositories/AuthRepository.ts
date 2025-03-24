import { User } from "../models/User";
import pool from "../src/database";

export class AuthRepository {
  async findUserByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      userId,
    ]);
  }

  async findUserByRefreshToken(
    refreshToken: string
  ): Promise<User | undefined> {
    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token = $1",
      [refreshToken]
    );
    return result.rows[0];
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await pool.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [
      userId,
    ]);
  }

  async createUser(username: string, password: string): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role",
      [username, password]
    );
    return result.rows[0];
  }

  async checkDuplicateUsername(username: string): Promise<boolean> {
    const result = await pool.query("SELECT 1 FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows.length > 0;
  }
}
