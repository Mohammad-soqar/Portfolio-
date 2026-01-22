"use client";
export const dynamic = "force-dynamic";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Map common Firebase errors to user-friendly messages
      let msg = err.message;
      if (err.code === "auth/invalid-credential")
        msg = "Incorrect email or password.";
      if (err.code === "auth/email-already-in-use")
        msg = "This email is already registered.";
      if (err.code === "auth/weak-password")
        msg = "Password should be at least 6 characters.";
      if (err.code === "auth/configuration-not-found")
        msg = "Email/Password provider not enabled in Firebase Console.";

      setError(msg || "Authentication failed. Please try again.");
    }
  };

  return (
    <div className="admin-login-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-card glass"
      >
        <h1>{isRegistering ? "Create Admin" : "Admin Login"}</h1>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.9rem",
            opacity: 0.7,
          }}
        >
          {isRegistering
            ? "Already have an account?"
            : "Need to create an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isRegistering ? "Login here" : "Register here"}
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .admin-login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          color: white;
          font-family: inherit;
        }
        .login-card {
          padding: 3rem;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }
        h1 {
          margin-bottom: 2rem;
          text-align: center;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
        input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          outline: none;
        }
        input:focus {
          border-color: #3b82f6;
        }
        .login-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }
        .login-btn:hover {
          background: #2563eb;
        }
        .error-msg {
          color: #ef4444;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
