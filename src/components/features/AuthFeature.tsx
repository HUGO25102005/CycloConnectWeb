import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../../pages";

const AuthFeature: React.FC = () => {

  return (
    <Routes>
        
      <Route path="/" element={<Navigate to="login" replace />} />
      <Route path="login" element={<LoginPage />} />
      {/* <Route path="register" element={<RegisterPage />} /> */}
      {/* <Route path="activate-account" element={<ActivateAccountPage />} /> */}
    </Routes>
  );
};

export default AuthFeature;
