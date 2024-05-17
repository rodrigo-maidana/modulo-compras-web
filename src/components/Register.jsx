import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "https://api.rodrigomaidana.com:8080/auth/register",
        {
          username,
          password,
          firstName,
          lastName,
        }
      );
      console.log(response.data);
      navigate("/categorias"); // Redirigir a la página principal después del registro
    } catch (err) {
      console.log(err);
      setError("Registration failed, please try again.");
    }
  };

  return (
    <div className="register-container container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            className="form-control"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            className="form-control"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            className="form-control"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>
    </div>
  );
};
