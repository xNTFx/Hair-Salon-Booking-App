export interface UserDTO {
  userId: string;
  username: string;
  role: "user" | "admin" | "employee";
  refreshToken?: string;
}

export interface AvailableHoursDTO {
  id?: number;
  employeeId: number;
  startTime: string;
  endTime: string;
}

export interface EmployeeDTO {
  employeeId?: number;
  firstName: string;
  lastName: string;
}

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

// DTO for Service
export interface ServiceDTO {
  serviceId?: number;
  serviceName: string;
  serviceDescription: string;
  serviceDuration: string;
}
