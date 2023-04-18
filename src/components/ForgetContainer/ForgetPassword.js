import { useAuth } from "context/AuthContext";
import "./ForgetStyle.css";
import React, { useState } from "react";

function ForgetPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="authContainer">
      <div className="signInUp">
        <div className="box">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Reset Password</button>
          </form>
          <div className="message">{message}</div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
