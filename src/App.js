import Dash from "Dash";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/ProtecteDRouted/ProtectedRouted";
import LoginContainer from "components/LogInContainer/LoginContainer";
import ForgetPassword from "components/ForgetContainer/ForgetPassword";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dash />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/forget" element={<ForgetPassword />} />
      </Routes>
    </AuthProvider>
  );
}
