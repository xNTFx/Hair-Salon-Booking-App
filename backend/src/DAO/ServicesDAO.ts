import { ServiceDTO } from "../DTO/DTO";
import pool from "../database";

export class ServicesDAO {
  async getAllServices(): Promise<ServiceDTO[]> {
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
