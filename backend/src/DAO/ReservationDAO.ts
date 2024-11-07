import { ReservationDTO } from "../DTO/DTO";
import pool from "../database";

export class ReservationsDAO {
  async getAllReservations(): Promise<ReservationDTO[]> {
    const result = await pool.query(`
      SELECT id AS "reservationId", employee_id AS "employeeId", service_id AS "serviceId", user_id AS "userId", 
             reservation_date AS "reservationDate", start_time AS "startTime", end_time AS "endTime", status AS "status"
      FROM reservations
    `);
    return result.rows;
  }

  async cancelReservation(reservationId: number): Promise<ReservationDTO> {
    const result = await pool.query(
      `
      UPDATE reservations 
      SET status = 'CANCELLED' 
      WHERE id = $1 
      RETURNING id AS "reservationId", employee_id AS "employeeId", service_id AS "serviceId", user_id AS "userId", 
                reservation_date AS "reservationDate", start_time AS "startTime", end_time AS "endTime", status AS "status"
    `,
      [reservationId]
    );
    return result.rows[0];
  }

  async createReservation(
    reservation: ReservationDTO
  ): Promise<ReservationDTO> {
    const result = await pool.query(
      `
      INSERT INTO reservations (employee_id, service_id, user_id, reservation_date, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id AS "reservationId", employee_id AS "employeeId", service_id AS "serviceId", user_id AS "userId", 
                reservation_date AS "reservationDate", start_time AS "startTime", end_time AS "endTime", status AS "status"
    `,
      [
        reservation.employeeId,
        reservation.serviceId,
        reservation.userId,
        reservation.reservationDate,
        reservation.startTime,
        reservation.endTime,
        reservation.status,
      ]
    );
    return result.rows[0];
  }

  async getAllActiveReservations(userId: string): Promise<ReservationDTO[]> {
    const result = await pool.query(
      `
      SELECT r.id, 
             to_char(r.reservation_date, 'YYYY-MM-DD') AS "reservationDate",
             r.start_time AS "startTime", 
             r.end_time AS "endTime", 
             r.status, 
             json_build_object(
               'id', s.id, 
               'name', s.name, 
               'price', s.price, 
               'duration', s.duration
             ) AS service, 
             json_build_object(
               'employeeId', e.employee_id, 
               'firstName', e.first_name, 
               'lastName', e.last_name
             ) AS employee
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      JOIN employees e ON r.employee_id = e.employee_id
      WHERE r.user_id = $1 AND r.status = 'PENDING'
    `,
      [userId]
    );

    return result.rows;
  }

  async getAllHistoryReservations(userId: string): Promise<ReservationDTO[]> {
    const result = await pool.query(
      `
     SELECT r.id, 
             to_char(r.reservation_date, 'YYYY-MM-DD') AS "reservationDate",
             r.start_time AS "startTime", 
             r.end_time AS "endTime", 
             r.status, 
             json_build_object(
               'id', s.id, 
               'name', s.name, 
               'price', s.price, 
               'duration', s.duration
             ) AS service, 
             json_build_object(
               'employeeId', e.employee_id, 
               'firstName', e.first_name, 
               'lastName', e.last_name
             ) AS employee
      FROM reservations r
      JOIN services s ON r.service_id = s.id
      JOIN employees e ON r.employee_id = e.employee_id
      WHERE r.user_id = $1 AND (r.status = 'CANCELLED' OR r.status = 'COMPLETED')
    `,
      [userId]
    );

    return result.rows;
  }

  async updateCompletedReservations(): Promise<void> {
    await pool.query(`
      UPDATE reservations 
      SET status = 'COMPLETED' 
      WHERE status = 'PENDING' 
      AND reservation_date <= CURRENT_DATE 
      AND end_time < CURRENT_TIME
    `);
  }
}
