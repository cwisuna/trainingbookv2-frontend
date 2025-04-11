import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TrainingGrid from "../components/TrainingGrid";
import { hasRole } from "../utils/auth";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Department {
  departmentID: number;
  departmentName: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = hasRole(user, "Admin");
  const isManager = hasRole(user, "Manager");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("https://localhost:44342/api/Departments");
        if (!response.ok) throw new Error("Failed to fetch departments");

        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedDept(event.target.value);
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
            value={selectedDept}
            onChange={handleSelectChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Department" }}
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
            {departments.map((dept) => (
              <MenuItem key={dept.departmentID} value={dept.departmentID}>
                {dept.departmentName}
              </MenuItem>
            ))}
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
