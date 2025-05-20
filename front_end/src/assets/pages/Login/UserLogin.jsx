import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserLogin.css';

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const navigate = useNavigate();

  const notify = (type, message) => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
const handleLogin = async (e) => {
  e.preventDefault();

  const loginData = {
    email,
    password,
    role,
  };

  try {
    const response = await fetch("http://localhost:8998/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.status === 200 && data.token) {
      localStorage.setItem("token", data.token);
      notify("success", "Login successful");

      // Redirect based on role
      if (role === "ADMIN") {
        navigate("/AdminDashboard");
      } else if (role === "CUSTOMER") {
        navigate("/CustomerHome");
      } else if (role === "DELIVERY_PERSON") {
        navigate("/Delivary-Home");
      }
    } else {
      notify("error", data.message || "Invalid login credentials");
    }
  } catch (error) {
    console.error("Login failed:", error);
    notify("error", "Server error. Try again.");
  }
};

  return (
    <div className="outer-container">
      <div className="disc_container">
        <span><label>Sv</label><label className="kart">Kart</label></span>
        <h3>
          sv Kart provides a comprehensive eCommerce solution for businesses,<br />
          enabling them to sell<br /> products online efficiently.
        </h3>
      </div>

      <div className="inner-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>User Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Login
          </button>
          <div className="login-options">
            <p className="signup-option">
              Don't have an account? <a href="/SignIn">Sign Up</a>
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
