import React from "react";
import { useAuth } from "../context/AuthContext";
import TrainingGrid from "../components/TrainingGrid";
import { hasRole } from "../utils/auth";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const isAdmin = hasRole(user, "Admin");
  const isManager = hasRole(user, "Manager");

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {isAdmin && (
        <div style={{ marginBottom: "10px" }}>
          <button>Add Department</button>
          <button>Edit Department</button>
          <button>Delete Department</button>
          <button>Manage Users</button>
        </div>
      )}

      {(isAdmin || isManager) && (
        <button style={{ marginBottom: "20px" }}>
          Assign Training Steps
        </button>
      )}

      <TrainingGrid />
    </div>
  );
};

export default DashboardPage;
