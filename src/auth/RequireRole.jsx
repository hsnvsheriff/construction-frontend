import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function RequireRole({ children, expectedRole }) {
  const [user, loading] = useAuthState(auth);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        console.log("⚠️ No user found");
        setAuthorized(false);
        setChecking(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.warn("❌ No Firestore document for user");
          setAuthorized(false);
          return;
        }

        const role = docSnap.data()?.role?.toLowerCase()?.trim();
        console.log(`🔍 Role check: expected ${expectedRole}, found ${role}`);

        setAuthorized(role === expectedRole);
      } catch (err) {
        console.error("🔥 Error checking role:", err.message);
        setAuthorized(false);
      } finally {
        setChecking(false);
      }
    };

    checkRole();
  }, [user, expectedRole]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Checking role...
      </div>
    );
  }

  if (!user || !authorized) {
    console.log("⛔ Redirecting to login...");
    return <Navigate to="/login" />;
  }

  return children;
}
