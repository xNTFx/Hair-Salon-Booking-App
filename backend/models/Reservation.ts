export interface ReservationDTO {
  reservationId?: number;
  employeeId: number;
  serviceId: number;
  userId: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}
