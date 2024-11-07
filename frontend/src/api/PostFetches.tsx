import axios from "axios";
import { AxiosError } from "axios";
import { CreateReservationTypes } from "../types/Types";

const createReservationWithoutAuth = async (
  reservationData: CreateReservationTypes
) => {
  try {
    console.log(reservationData);
    const response = await axios.post(
      "http://localhost:3000/reservations/createWithoutAuth",
      reservationData,
      {}
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const createReservationWithAuth = async (
  reservationData: CreateReservationTypes,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/reservations/createWithAuth",
      reservationData,
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
      "Error creating reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

const cancelReservation = async (
  reservationId: number | null,
  refreshResponse: string | null
) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/reservations/cancel/${reservationId}`,
      {},
      {
        headers: {
          Authorization: refreshResponse ? `Bearer ${refreshResponse}` : "",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling reservation:",
      (error as AxiosError).response
        ? (error as AxiosError).response?.data
        : (error as Error).message
    );
    throw error;
  }
};

export {
  createReservationWithoutAuth,
  createReservationWithAuth,
  cancelReservation,
};
