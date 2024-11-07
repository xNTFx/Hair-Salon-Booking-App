import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AvailableHoursRouter } from "./Routes/AvailableHoursRoutes";
import { EmployeeRouter } from "./Routes/EmployeeRoutes";
import { ReservationRouter } from "./Routes/ReservationsRoutes";
import { ServiceRouter } from "./Routes/ServicesRoutes";
import { AuthRouter } from "./Routes/AuthRoutes";
import { UserRouter } from "./Routes/UserRouter";

const app = express();
const port = {{ project.BACKEND_PORT }};

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/available_hours", AvailableHoursRouter);
app.use("/api/employees", EmployeeRouter);
app.use("/api/reservations", ReservationRouter);
app.use("/api/services", ServiceRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.get("/api", (req: Request, res: Response) => {
  res.send("Hairdresser Booking System API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
