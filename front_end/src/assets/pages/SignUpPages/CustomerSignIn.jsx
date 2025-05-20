import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './CusomerSignin.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';  // <-- Import Bounce here
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerSignIn() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const navigate = useNavigate();

  const notify = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      phoneNumber,
      role,
    };

    try {
      const response = await fetch("http://localhost:8998/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const message = await response.text();

      if (response.status === 200) {
        localStorage.setItem("phoneNumber", phoneNumber);
        notify(" Sign-up successful!");
        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (role === "CUSTOMER") {
          navigate("/customer-dashboard");
        } else if (role === "DELIVERY_PERSON") {
          navigate("/delivery-home");
        }
      } else {
        notify( (message || "Invalid sign-up credentials"));
      }
    } catch (error) {
      console.error("Login error:", error);
      notify(" An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Sign In</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            required
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
            <option value="DELIVERY_PERSON">Delivery</option>
          </select>

          <button type="submit" className="submit-btn">
            Sign In
          </button>

          <div className="login-options">
            <p className="signup-option">
              Have An Account? <a href="/">Login</a>
            </p>
            <p className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </p>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
