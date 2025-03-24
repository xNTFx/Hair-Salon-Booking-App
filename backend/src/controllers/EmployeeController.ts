import { Request, Response } from "express";
import { EmployeeService } from "../services/EmployeeService";

const employeeService = new EmployeeService();

export class EmployeeController {
  static async getAll(req: Request, res: Response) {
    try {
      const employees = await employeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
