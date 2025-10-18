// src/components/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verify } from "../services/authService";

type Props = {
  children: ReactNode;
  requiredRole?: string;
};

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      try {
        const user = await verify();
        if (!requiredRole || user.role === requiredRole) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [requiredRole]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!authorized) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
