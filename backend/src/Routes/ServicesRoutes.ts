import { Router, Request, Response } from 'express';
import { ServicesDAO } from '../DAO/ServicesDAO';

const ServiceRouter = Router();
const servicesDAO = new ServicesDAO();

ServiceRouter.get('/', async (req: Request, res: Response) => {
  try {
    const services = await servicesDAO.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { ServiceRouter };
