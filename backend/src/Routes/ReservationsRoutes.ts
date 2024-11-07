import { Router, Request, Response } from "express";
import { ReservationsDAO } from "../DAO/ReservationDAO";
import { verifyJWT } from "../Middleware/verifyJWT";
import jwt from "jsonwebtoken";
import { UserDAO } from "../DAO/UserDAO";

const ReservationRouter = Router();
const reservationsDAO = new ReservationsDAO();
const userDAO = new UserDAO();

ReservationRouter.get("/", async (req: Request, res: Response) => {
  try {
    const reservations = await reservationsDAO.getAllReservations();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

ReservationRouter.get(
  "/active",
  verifyJWT,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is missing" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { username: string; id: string };
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const foundUser = await userDAO.findUserById(decodedToken.id);

      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const activeReservations = await reservationsDAO.getAllActiveReservations(
        foundUser.id
      );

      res.json(activeReservations);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to retrieve user: " + err.message });
    }
  }
);

ReservationRouter.get(
  "/history",
  verifyJWT,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is missing" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { id: string };
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const historyReservations =
        await reservationsDAO.getAllHistoryReservations(decodedToken.id);
      res.status(200).json(historyReservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

ReservationRouter.put(
  "/cancel/:id",
  verifyJWT,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is missing" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { id: string };
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const cancelledReservation = await reservationsDAO.cancelReservation(
        parseInt(id)
      );
      res.status(200).json(cancelledReservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

ReservationRouter.post(
  "/createWithoutAuth",
  async (req: Request, res: Response): Promise<any> => {
    const { service, employee, status, ...rest } = req.body;

    const reservation = {
      ...rest,
      userId: "0",
      employeeId: employee.employeeId,
      serviceId: service.id,
      status: status || "PENDING",
    };

    console.log("Processed Reservation Data:", reservation);

    if (
      !reservation.employeeId ||
      !reservation.serviceId ||
      !reservation.status
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const createdReservation = await reservationsDAO.createReservation(
        reservation
      );
      res.status(200).json(createdReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

ReservationRouter.post(
  "/createWithAuth",
  verifyJWT,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const accessToken = authHeader.split(" ")[1];
      if (!accessToken) {
        return res.status(400).json({ message: "Access token is missing" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as { id: string };
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      const foundUser = await userDAO.findUserById(decodedToken.id);
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { employee, service, status, ...rest } = req.body;

      const reservation = {
        ...rest,
        employeeId: employee.employeeId,
        serviceId: service.id,
        status: status || "PENDING",
        userId: decodedToken.id,
      };

      console.log("Processed Reservation Data:", reservation);

      if (
        !reservation.employeeId ||
        !reservation.serviceId ||
        !reservation.status
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const createdReservation = await reservationsDAO.createReservation(
        reservation
      );
      res.status(200).json(createdReservation);
    } catch (error) {
      console.error("Error creating reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export { ReservationRouter };
