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
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/available_hours", AvailableHoursRouter);
app.use("/employees", EmployeeRouter);
app.use("/reservations", ReservationRouter);
app.use("/services", ServiceRouter);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);

app.get("/api", (req: Request, res: Response) => {
  res.send("Hairdresser Booking System API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
