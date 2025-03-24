import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";
import { verifyJWT } from "../Middleware/verifyJWT";

const router = Router();

router.get("/", ReservationController.getAll);
router.get("/active", verifyJWT, ReservationController.getActive);
router.get("/history", verifyJWT, ReservationController.getHistory);
router.put("/cancel/:id", verifyJWT, ReservationController.cancel);
router.post("/createWithoutAuth", ReservationController.createWithoutAuth);
router.post("/createWithAuth", verifyJWT, ReservationController.createWithAuth);

export default router;
