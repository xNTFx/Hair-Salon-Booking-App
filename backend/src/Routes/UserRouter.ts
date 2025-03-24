import { Router } from "express";
import { verifyJWT } from "../Middleware/verifyJWT";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/profile", verifyJWT, UserController.getProfile);

export default router;
