import { Service } from "../models/Service";
import pool from "../src/database";

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    const result = await pool.query(`
      SELECT id, name, duration, price::NUMERIC AS price
      FROM services
    `);
    return result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
    }));
  }
}
