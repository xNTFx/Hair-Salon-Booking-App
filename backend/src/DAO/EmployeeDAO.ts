import { EmployeeDTO } from "../DTO/DTO";
import pool from "../database";

export class EmployeeDAO {
  async getAllEmployees(): Promise<EmployeeDTO[]> {
    const result = await pool.query(`
      SELECT employee_id AS "employeeId", first_name AS "firstName", last_name AS "lastName" 
      FROM employees
    `);
    return result.rows;
  }
}
