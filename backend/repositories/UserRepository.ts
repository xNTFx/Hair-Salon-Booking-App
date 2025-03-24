import { User } from "../models/User";
import pool from "../src/database";

export class UserRepository {
  async findByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query(
      "SELECT id, username, role FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await pool.query(
      "SELECT id, username, role FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }
}
