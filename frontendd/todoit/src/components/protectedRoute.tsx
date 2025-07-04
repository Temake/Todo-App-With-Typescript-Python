import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constant";
import React, { useEffect, useState } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setAuthorization] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setAuthorization(false));
  }, []);
  interface AccesToken {
    access: string;
  }
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post<AccesToken>("api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setAuthorization(true);
      } else {
        setAuthorization(false);
      }
    } catch (error) {
      console.log(error);
      setAuthorization(false);
    }
  };
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setAuthorization(false);
      return;
    }
    type JwtPayload = {
      exp: number;
      [key: string]: string | number | boolean | undefined;
    };

    const decoded = jwtDecode<JwtPayload>(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setAuthorization(true);
    }
  };
  if (isAuthorized === null) {
    return <div>Loading......</div>;
  }
  return isAuthorized ? children : <Navigate to="/login/" />;
}

export default ProtectedRoute;
