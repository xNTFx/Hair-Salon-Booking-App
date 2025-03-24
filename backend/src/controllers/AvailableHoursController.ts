import { Request, Response } from "express";
import { AvailableHoursService } from "../services/AvailableHoursService";

const availableHoursService = new AvailableHoursService();

export class AvailableHoursController {
  static async getAll(req: Request, res: Response) {
    try {
      const hours = await availableHoursService.getAll();
      res.status(200).json(hours);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getByEmployeeDateDuration(req: Request, res: Response) {
    const { employeeId, reservationDate, duration } = req.params;

    try {
      const hours = await availableHoursService.getAvailableForEmployee(
        parseInt(employeeId),
        reservationDate,
        duration
      );
      res.status(200).json(hours);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
