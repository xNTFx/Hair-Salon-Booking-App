import { Router, Request, Response } from 'express';
import { AvailableHoursDAO } from '../DAO/AvailableHoursDAO';

const AvailableHoursRouter = Router();
const availableHoursDAO = new AvailableHoursDAO();

AvailableHoursRouter.get('/', async (req: Request, res: Response) => {
  try {
    const availableHours = await availableHoursDAO.getAll();
    res.status(200).json(availableHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

AvailableHoursRouter.get('/employee/:employeeId/reservation_date/:reservationDate/duration/:duration', async (req: Request, res: Response) => {
  const { employeeId, reservationDate, duration } = req.params;

  try {
    const availableHours = await availableHoursDAO.findAvailableHoursByEmployeeId(
      parseInt(employeeId),
      reservationDate,
      duration
    );
    res.status(200).json(availableHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { AvailableHoursRouter };
