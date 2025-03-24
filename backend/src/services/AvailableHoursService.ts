import { AvailableHours } from "../models/AvailableHours";
import { AvailableHoursRepository } from "../repositories/AvailableHoursRepository";

export class AvailableHoursService {
  private repository = new AvailableHoursRepository();

  async getAll(): Promise<AvailableHours[]> {
    return this.repository.findAll();
  }

  async getAvailableForEmployee(
    employeeId: number,
    reservationDate: string,
    duration: string
  ): Promise<AvailableHours[]> {
    return this.repository.findByEmployeeAndDate(
      employeeId,
      reservationDate,
      duration
    );
  }
}
