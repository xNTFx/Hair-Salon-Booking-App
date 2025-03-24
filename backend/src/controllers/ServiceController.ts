import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';

const serviceService = new ServiceService();

export class ServiceController {
  static async getAll(req: Request, res: Response) {
    try {
      const services = await serviceService.getAllServices();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
