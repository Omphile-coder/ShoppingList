import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserByEmail, registerUser } from "../services/authService";

export const RegisterPage = () => {
  const navigate = useNavigate();

  // State to hold our form inputs
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    cellNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSucess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSucess("");

    try {
      //   check if the email already in use
      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        setError("An account with this enail alrady exists.");
        return;
      }

      //   register the user
      await registerUser(formData);

      //   Show success message and redirects to login
      setSucess("Account created! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong during registration.");
    }
  };
  return (
    <main className="auth-container">
      <h1>Create Account</h1>

      {error && <p className="alert-error">{error}</p>}

      {success && <p className="alert-success">{success}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="surname"
          type="text"
          placeholder="Surname"
          required
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="cellNumber"
          type="tel"
          placeholder="Cell Number"
          required
          onChange={handleChange}
          className="auth-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          minLength={8}
          required
          onChange={handleChange}
          className="auth-input"
        />

        <button type="submit" className="auth-button">
          Register
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </main>
  );
};
