import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { User } from "../types/Types";

export default function useAuthLogged() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const isLoggedIn = !!Cookies.get("isLoggedIn");

  useEffect(() => {
    if (!isLoggedIn) {
      setIsUserLoading(false);
      return;
    }

    let isMounted = true;
    setIsUserLoading(true);

    const fetchUserData = async () => {
      try {
        const refreshResponse = await axios.get(
          "http://localhost:3000/auth/refresh",
          {
            withCredentials: true,
          }
        );

        const accessToken = refreshResponse.data.accessToken;

        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        if (isMounted) {
          console.log(response.data);

          setUser({
            id: response.data.id,
            username: response.data.username,
            role: response.data.role,
          });
          setIsUserLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsUserLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  if (error) {
    console.error(error);
  }

  return { user, isUserLoading, setUser };
}
