import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./Routes/routes";
import { corsOptions } from "./config/corsOptions";

const app = express();
const port = Number(process.env.BACKEND_PORT) || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/api", (req: Request, res: Response) => {
  res.send("Hairdresser Booking System API");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
