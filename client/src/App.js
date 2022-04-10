import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth";

function App() {
  // wrapping the each pages by higher-order-component (HOC) for authentication
  const HocLandingPage = Auth(LandingPage, null);
  const HocLoginPage = Auth(LoginPage, false);
  const HocRegisterPage = Auth(RegisterPage, false);

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<HocLandingPage />} />
          <Route exact path="/login" element={<HocLoginPage />} />
          <Route exact path="/register" element={<HocRegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
