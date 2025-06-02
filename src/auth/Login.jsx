// src/auth/Login.jsx
import React, { useState } from 'react';
import { db, loginWithPersistence } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    console.log("🌐 Attempting login...");

    const user = await loginWithPersistence(email, password); // ✅ user, not userCredential
    const uid = user.uid;

    console.log("✅ Login success, UID:", uid);

    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("❌ Firestore user doc not found");
      setError("User data not found in Firestore.");
      return;
    }

    const role = docSnap.data()?.role?.trim().toLowerCase();
    console.log("👤 Role from Firestore:", role);

    if (role === 'company') {
  navigate('/dashboard/Construction');
} else if (role === 'designer') {
  navigate('/dashboard/designer');
} else if (role === 'superadmin') {
  navigate('/dashboard/superadmin'); // ✅ new route for superadmin
} else {
  console.warn("❌ Unknown role:", role);
  setError("Unauthorized role: " + role);
}

  } catch (err) {
    console.error("🔥 Login error:", err.message);
    setError(err.message);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-lg space-y-4 w-full max-w-md shadow">
        <h2 className="text-xl font-bold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded bg-zinc-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full py-2 bg-white text-black rounded hover:bg-gray-300">
          Login
        </button>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </form>
    </div>
  );
}
