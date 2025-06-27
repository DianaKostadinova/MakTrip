import React, { useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./Firebase";

export default function AuthModal({ onClose, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");

    const handleAuth = () => {
        setError("");
        if (mode === "login") {
            signInWithEmailAndPassword(auth, email, password)
                .then(res => onLoginSuccess(res.user))
                .catch(err => setError("Login failed: " + err.message));
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then(res => onLoginSuccess(res.user))
                .catch(err => setError("Registration failed: " + err.message));
        }
    };

    return (
        <div className="modal">
            <h3>{mode === "login" ? "Login to Save" : "Sign Up"}</h3>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button className="btn btn-primary" onClick={handleAuth}>
                    {mode === "login" ? "Log In" : "Sign Up"}
                </button>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>

            <p
                style={{
                    marginTop: "1rem",
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                }}
                onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
                {mode === "login"
                    ? "Don't have an account? Sign up here"
                    : "Already have an account? Log in"}
            </p>
        </div>
    );
}
