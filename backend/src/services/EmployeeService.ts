import { Employee } from "../../models/Employee";
import { EmployeeRepository } from "../../repositories/EmployeeRepository";


export class EmployeeService {
  private repository = new EmployeeRepository();

  async getAllEmployees(): Promise<Employee[]> {
    return this.repository.findAll();
  }
}
