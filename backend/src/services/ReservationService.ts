import { ReservationsRepository } from "../repositories/ReservationsRepository";

export class ReservationService {
  private repository = new ReservationsRepository();

  async getAll() {
    return this.repository.getAllReservations();
  }

  async getActive(userId: string) {
    return this.repository.getAllActiveReservations(userId);
  }

  async getHistory(userId: string) {
    return this.repository.getAllHistoryReservations(userId);
  }

  async cancel(reservationId: number) {
    return this.repository.cancelReservation(reservationId);
  }

  async createAnonymous(data: any) {
    const { service, employee, status, ...rest } = data;

    return this.repository.createReservation({
      ...rest,
      userId: "0",
      employeeId: employee.employeeId,
      serviceId: service.id,
      status: status || "PENDING",
    });
  }

  async createAuthenticated(data: any, userId: string) {
    const { service, employee, status, ...rest } = data;

    return this.repository.createReservation({
      ...rest,
      userId,
      employeeId: employee.employeeId,
      serviceId: service.id,
      status: status || "PENDING",
    });
  }
}
