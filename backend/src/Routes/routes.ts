import { Router } from "express";
import AvailableHoursRouter from "./AvailableHoursRoutes";
import EmployeeRouter from "./EmployeeRoutes";
import ReservationRouter from "./ReservationsRoutes";
import ServiceRouter from "./ServicesRoutes";
import AuthRouter from "./AuthRoutes";
import UserRouter from "./UserRouter";

const router = Router();

router.use("/available_hours", AvailableHoursRouter);
router.use("/employees", EmployeeRouter);
router.use("/reservations", ReservationRouter);
router.use("/services", ServiceRouter);
router.use("/auth", AuthRouter);
router.use("/user", UserRouter);

export default router;
