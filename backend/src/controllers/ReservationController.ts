import { Request, Response, NextFunction, RequestHandler } from "express";
import { ReservationService } from "../services/ReservationService";

const reservationService = new ReservationService();

export class ReservationController {
  static getAll: RequestHandler = async (req, res, next) => {
    try {
      const reservations = await reservationService.getAll();
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  static getActive: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const reservations = await reservationService.getActive(req.user.id);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  };

  static getHistory: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const reservations = await reservationService.getHistory(req.user.id);
      res.status(200).json(reservations);
    } catch (error) {
      next(error);
    }
  };

  static cancel: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
      const cancelled = await reservationService.cancel(parseInt(id));
      res.status(200).json(cancelled);
    } catch (error) {
      next(error);
    }
  };

  static createWithoutAuth: RequestHandler = async (req, res, next) => {
    try {
      const reservation = await reservationService.createAnonymous(req.body);
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };

  static createWithAuth: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const reservation = await reservationService.createAuthenticated(
        req.body,
        req.user.id
      );
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  };
}
