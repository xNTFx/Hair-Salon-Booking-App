import pool from "../database";

export class UserDAO {
  async findUserByUsername(username: string) {
    const result = await pool.query(
      "SELECT id, username, role FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0];
  }

  async findUserById(id: string) {
    const result = await pool.query(
      "SELECT id, username, role FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }
}
