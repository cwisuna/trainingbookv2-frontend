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
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("https://localhost:44342/api/departments");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedDept(event.target.value);
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return;

    try {
      const response = await fetch("https://localhost:44342/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ departmentName: newDepartmentName }),
      });

      if (!response.ok) throw new Error("Failed to add department");

      const newDept: Department = await response.json();
      setDepartments((prev) => [...prev, newDept]);
      setSelectedDept(String(newDept.departmentID));
      setNewDepartmentName("");
      setShowInput(false);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDept) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:44342/api/departments/${selectedDept}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete department");

      setDepartments((prev) =>
        prev.filter((d) => d.departmentID !== parseInt(selectedDept))
      );
      setSelectedDept("");
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user.name}</h2>

      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {(isAdmin || isManager) && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
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

            <button onClick={() => setShowInput(true)}>Add Department</button>
            <button
              onClick={() => {
                if (!selectedDept) return;
                const dept = departments.find((d) => d.departmentID === parseInt(selectedDept));
                if (dept) {
                  setEditName(dept.departmentName);
                  setEditing(true);
                }
              }}
              disabled={!selectedDept}
            >
              Edit Department
            </button>

            <button onClick={handleDeleteDepartment} disabled={!selectedDept}>
              Delete Department
            </button>

            <button>Manage Users</button>
            <button>Assign Training Steps</button>
          </div>

          {showInput && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="New Department Name"
                style={{
                  height: "30px",
                  fontSize: "14px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button onClick={handleAddDepartment}>Create</button>
              <button onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          )}

          {editing && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Edit Department Name"
                style={{
                  height: "30px",
                  fontSize: "14px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={async () => {
                  if (!selectedDept || !editName.trim()) return;
                  try {
                    const response = await fetch(
                      `https://localhost:44342/api/departments/${selectedDept}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ departmentName: editName }),
                      }
                    );

                    if (!response.ok) throw new Error("Failed to update department");

                    setDepartments((prev) =>
                      prev.map((d) =>
                        d.departmentID === parseInt(selectedDept)
                          ? { ...d, departmentName: editName }
                          : d
                      )
                    );

                    setEditing(false);
                    setEditName("");
                  } catch (error) {
                    console.error("Error updating department:", error);
                  }
                }}
              >
                Update
              </button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          )}
        </>
      )}

      <TrainingGrid />

{(isAdmin || isManager) && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "20px",
    }}
  >
    <button>Add Training Step</button>
    <button>Edit Training Step</button>
    <button>Delete Training Step</button>
  </div>
)}
    </div>
  );
};

export default DashboardPage;
