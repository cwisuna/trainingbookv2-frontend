import React from "react";
import { useAuth } from "../context/AuthContext";
import TrainingGrid from "../components/TrainingGrid";
import { hasRole } from "../utils/auth";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = hasRole(user, "Admin");
  const isManager = hasRole(user, "Manager");

  const [selection, setSelection] = React.useState("");

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelection(event.target.value as string);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {(isAdmin || isManager) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          
          <Select
            value={selection}
            onChange={handleSelectChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Option" }}
            style={{
              height: "36px",
              padding: "0 12px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            <MenuItem value="" disabled>
              Select Department
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>

          <button>Add Department</button>
          <button>Edit Department</button>
          <button>Delete Department</button>
          <button>Manage Users</button>
          <button>Assign Training Steps</button>
        </div>
      )}

      <TrainingGrid />
    </div>
  );
};

export default DashboardPage;
