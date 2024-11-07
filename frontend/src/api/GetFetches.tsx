const fetchServices = async () => {
  const response = await fetch("http://localhost:3000/services");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchEmployees = async () => {
  const response = await fetch("http://localhost:3000/employees");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
const fetchAvaiableHours = async (
  date: string | null,
  employeeId: number | undefined,
  serviceDuration: string
) => {
  if (employeeId === undefined) return;
  const response = await fetch(
    `http://localhost:3000/available_hours/employee/${employeeId}/reservation_date/${date}/duration/${serviceDuration}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

import axios, { AxiosError } from "axios";

const fetchActiveReservations = async (accessToken: string | null) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/reservations/active",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const fetchHistoryReservations = async (accessToken: string | null) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/reservations/history",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active reservations:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

export {
  fetchServices,
  fetchEmployees,
  fetchAvaiableHours,
  fetchActiveReservations,
  fetchHistoryReservations,
};
