import { Router, Request, Response } from 'express';
import { EmployeeDAO } from '../DAO/EmployeeDAO';

const EmployeeRouter = Router();
const employeeDAO = new EmployeeDAO();

EmployeeRouter.get('/', async (req: Request, res: Response) => {
  try {
    const employees = await employeeDAO.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { EmployeeRouter };
