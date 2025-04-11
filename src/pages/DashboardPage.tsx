import React from "react";
import { useAuth } from "../context/AuthContext";
import TrainingGrid from "../components/TrainingGrid";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "Admin";

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>

      {isAdmin && (
        <>
          <button>Add Department</button>
          <button>Edit Department</button>
          <button>Delete Department</button>
          <button>Manage Users</button>
        </>
      )}

      <button>Assign Training Steps</button>

      <TrainingGrid />
    </div>
  );
};

export default DashboardPage;
