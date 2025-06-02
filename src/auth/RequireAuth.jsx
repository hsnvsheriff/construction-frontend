// src/auth/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

const RequireAuth = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="min-h-screen flex justify-center items-center text-white">Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default RequireAuth;
