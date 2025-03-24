import { AvailableHours } from "../models/AvailableHours";
import pool from "../src/database";

export class AvailableHoursRepository {
  async findAll(): Promise<AvailableHours[]> {
    const result = await pool.query(`
      SELECT id, employee_id AS "employeeId", start_time AS "startTime", end_time AS "endTime"
      FROM available_hours
    `);
    return result.rows;
  }

  async findByEmployeeAndDate(
    employeeId: number,
    reservationDate: string,
    duration: string
  ): Promise<AvailableHours[]> {
    const result = await pool.query(
      `
      SELECT DISTINCT ON (ah.start_time, ah.end_time)
        ah.id, ah.start_time, ah.end_time, ah.employee_id
      FROM available_hours ah
      LEFT JOIN reservations r
        ON r.employee_id = ah.employee_id
        AND (r.start_time + $1::interval > ah.end_time)
        AND r.reservation_date = $2
      WHERE r.start_time IS NULL
        AND ($3 = 0 OR ah.employee_id = $3)
        AND (
          $2 > CURRENT_DATE OR
          (ah.start_time > (CURRENT_TIME + interval '1 hour') AND $2 = CURRENT_DATE)
        )
      ORDER BY ah.start_time, ah.end_time, ah.employee_id ASC
    `,
      [duration, reservationDate, employeeId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      employeeId: row.employee_id,
      startTime: row.start_time,
      endTime: row.end_time,
    }));
  }
}
