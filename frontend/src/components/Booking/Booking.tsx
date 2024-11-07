import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { fetchEmployees, refreshToken } from "../../api/GetFetches";
import {
  createReservationWithoutAuth,
  createReservationWithAuth,
} from "../../api/PostFetches";
import useGenerateDates from "../../hooks/useGenerateDates";
import {
  AvailableHoursTypes,
  CreateReservationTypes,
  EmployeesType,
} from "../../types/Types";
import convertTime from "../../utils/convertTime";
import DayPicker from "../DayPicker/DayPicker";
import EmployeePicker from "../EmployeePicker/EmployeePicker";
import LoadingPageComponent from "../LoadingComponents/LoadingPageComponent";
import TimePicker from "../TimePicker/TimePicker";
import "./Booking.css";
import { UserContext } from "../../context/UserContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import addTime from "../../utils/addTime";

interface BookingProps {
  selectedServices: {
    id: number;
    name: string;
    duration: string;
    price: number;
  };
  serviceDuration: string;
}

export default function Booking({
  selectedServices,
  serviceDuration,
}: BookingProps) {
  const { user } = useContext(UserContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const { data, error, isFetching } = useQuery(["employees"], fetchEmployees);
  const mutation = useMutation(
    async (reservationData: CreateReservationTypes) => {
      if (user?.id !== "0" && user?.id) {
        try {
          const refreshResponse = await refreshToken();
          return createReservationWithAuth(
            reservationData,
            refreshResponse.data.accessToken
          );
        } catch (error) {
          console.error(error);
        }
      }

      return createReservationWithoutAuth(reservationData);
    }
  );

  const handleCreateReservation = async (
    reservationData: CreateReservationTypes
  ) => {
    mutation.mutate(reservationData, {
      onSuccess: () => {
        navigate("/");
        showNotification("Reservation successfully made!", {
          backgroundColor: "green",
          textColor: "white",
          duration: 3000,
        });
      },
      onError: (error) => {
        console.error("Error creating reservation", error);
        showNotification("Error when creating a reservation!", {
          backgroundColor: "red",
          textColor: "white",
          duration: 3000,
        });
      },
    });
  };

  const generateDates = useGenerateDates();
  const listOfDates = generateDates();

  const [selectedDate, setSelectedDate] = useState(listOfDates[0]);
  const [selectedTime, setSelectedTime] = useState<AvailableHoursTypes | null>(
    null
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeesType | null>({
      employeeId: 0,
      firstName: "Anyone",
      lastName: undefined,
    });
  const [employeeIdForBooking, setEmployeeIdForBooking] = useState(
    selectedEmployee?.employeeId
  );
  const [isEmployeeSelect, setIsEmployeeSelect] = useState(false);

  if (error) {
    console.error(error);
    return;
  }
  if (isFetching) {
    return <LoadingPageComponent />;
  }
  if (!data) {
    return;
  }

  return isEmployeeSelect ? (
    <div className="employee-picker">
      <EmployeePicker
        employeesData={data}
        setIsEmployeeSelect={setIsEmployeeSelect}
        setSelectedEmployee={setSelectedEmployee}
        setSelectedTime={setSelectedTime}
      />
    </div>
  ) : (
    <div className="booking">
      <DayPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
      />
      <hr />
      <TimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        employeeId={selectedEmployee?.employeeId}
        setEmployeeIdForBooking={setEmployeeIdForBooking}
        serviceDuration={serviceDuration}
      />
      <hr />
      <div className="booking__service">
        <p className="booking__service-name">
          {selectedServices.name[0].toUpperCase() +
            selectedServices.name.slice(1)}
        </p>
        <div className="booking__service-details">
          <p className="booking__service-price">
            {selectedServices.price.toFixed(2)} PLN
          </p>
          <p className="booking__service-duration">
            {convertTime(selectedServices.duration)}
          </p>
        </div>
      </div>
      <div className="booking__employee">
        <p>
          <span style={{ color: "gray" }}>Employee: </span>
          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
        </p>
        <button
          onClick={() => setIsEmployeeSelect(true)}
          className="booking__change-btn"
        >
          Change
        </button>
      </div>
      <hr />
      <div className="booking__btn-container">
        <button
          onClick={async () => {
            try {
              const reservationData: CreateReservationTypes = {
                reservationDate: selectedDate,
                service: { id: selectedServices.id },
                employee: { employeeId: employeeIdForBooking },
                startTime: selectedTime?.startTime,
                endTime: addTime(selectedTime?.startTime, serviceDuration),
              };

              await handleCreateReservation(reservationData);
            } catch (error) {
              console.error("Error retrieving ID token: ", error);
            }
          }}
          className="booking__btn"
          style={!selectedTime ? { opacity: "0.1" } : undefined}
          disabled={!selectedTime}
        >
          Book
        </button>
      </div>
    </div>
  );
}
