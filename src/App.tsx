import React, { JSX } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AddTrainingStepPage from "./pages/AddTrainingStepPages";
import AddUsersPage from "./pages/AddUsersPage";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><MainPage /></PrivateRoute>} />
          <Route path="/add-training-step" element={<AddTrainingStepPage />} />
          <Route path="/add-user" element={<AddUsersPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
