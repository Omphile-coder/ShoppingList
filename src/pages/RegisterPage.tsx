import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import {
  getUserByEmail,
  registerUser,
  type RegisterData,
} from "../services/authService";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Initializes state to track the user's input across all registration fields and manage the loading UI
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    surname: "",
    email: "",
    cellNumber: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Dynamically updates the corresponding field in the form state based on the input's name attribute
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles form submission by checking for existing accounts before sending the new user data to the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Queries the database to prevent duplicate registrations with the same email address
      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        showToast("An account with this email already exists.", "error");
        return;
      }

      // Securely registers the new user in the database
      await registerUser(formData);

      // Notifies the user of success and routes them to the login page to authenticate
      showToast("Account created! Redirecting to login...", "success");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong during registration. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container register-container">
      <h1>Create Account</h1>

      {/* Renders the registration form, linking inputs to the state and disabling submission while loading */}
      <form onSubmit={handleSubmit} className="auth-form register-form">
        <div className="input-group">
          <label htmlFor="name" className="input-label">
            First Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            required
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="surname" className="input-label">
            Last Name:
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            placeholder="Surname"
            required
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Email Address:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="cellNumber" className="input-label">
            Cell Number:
          </label>
          <input
            id="cellNumber"
            name="cellNumber"
            type="tel"
            placeholder="Cell Number"
            required
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            minLength={8}
            required
            onChange={handleChange}
            className="auth-input"
          />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in here</Link>
      </p>
    </main>
  );
};