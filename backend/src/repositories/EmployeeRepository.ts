import { Employee } from "../models/Employee";
import pool from "../database";

export class EmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const result = await pool.query(`
      SELECT employee_id AS "employeeId", first_name AS "firstName", last_name AS "lastName"
      FROM employees
    `);
    return result.rows;
  }
}
