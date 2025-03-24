import { Router } from "express";
import { AvailableHoursController } from "../controllers/AvailableHoursController";

const router = Router();

router.get("/", AvailableHoursController.getAll);

router.get(
  "/employee/:employeeId/reservation_date/:reservationDate/duration/:duration",
  AvailableHoursController.getByEmployeeDateDuration
);

export default router;
