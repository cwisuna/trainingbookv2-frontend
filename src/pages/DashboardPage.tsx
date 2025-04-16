import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TrainingGrid from '../components/TrainingGrid';
import { hasRole } from '../utils/auth';
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  Department,
} from '../services/departmentService';
import { getUsersByDepartment, User } from '../services/userService';
import {
  updateTrainingStep,
  TrainingStep,
} from '../services/trainingStepService';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = hasRole(user, 'Admin');
  const isManager = hasRole(user, 'Manager');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedStep, setSelectedStep] = useState<TrainingStep | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFields, setEditFields] = useState<Partial<TrainingStep>>({});

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const deptId = event.target.value;
    setSelectedDept(deptId);
    setSelectedUser('');
    try {
      const fetchedUsers = await getUsersByDepartment(parseInt(deptId));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleUserChange = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value);
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) return;
    try {
      const newDept = await addDepartment(newDepartmentName);
      setDepartments((prev) => [...prev, newDept]);
      setSelectedDept(String(newDept.departmentID));
      setNewDepartmentName('');
      setShowInput(false);
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!selectedDept) return;
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this department?'
    );
    if (!confirmDelete) return;

    try {
      await deleteDepartment(parseInt(selectedDept));
      setDepartments((prev) =>
        prev.filter((d) => d.departmentID !== parseInt(selectedDept))
      );
      setSelectedDept('');
      setUsers([]);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleUpdateDepartment = async () => {
    if (!selectedDept || !editName.trim()) return;
    try {
      await updateDepartment(parseInt(selectedDept), editName);
      setDepartments((prev) =>
        prev.map((d) =>
          d.departmentID === parseInt(selectedDept)
            ? { ...d, departmentName: editName }
            : d
        )
      );
      setEditing(false);
      setEditName('');
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome, {user.name}</h2>
      <button onClick={logout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      {(isAdmin || isManager) && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <Select
              value={selectedDept}
              onChange={handleSelectChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select Department' }}
              style={{
                height: '36px',
                padding: '0 12px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
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

            <Select
              value={selectedUser}
              onChange={handleUserChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Select User' }}
              style={{
                height: '36px',
                padding: '0 12px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
              }}
              disabled={!users.length}
            >
              <MenuItem value="" disabled>
                Select User
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.userName} value={u.userName}>
                  {u.firstName} {u.lastName}
                </MenuItem>
              ))}
            </Select>

            <button onClick={() => setShowInput(true)}>Add Department</button>
            <button
              onClick={() => {
                if (!selectedDept) return;
                const dept = departments.find(
                  (d) => d.departmentID === parseInt(selectedDept)
                );
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="New Department Name"
                style={{
                  height: '30px',
                  fontSize: '14px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <button onClick={handleAddDepartment}>Create</button>
              <button onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          )}

          {editing && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Edit Department Name"
                style={{
                  height: '30px',
                  fontSize: '14px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <button onClick={handleUpdateDepartment}>Update</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          )}
        </>
      )}

      {selectedDept && (
        <TrainingGrid
          departmentId={parseInt(selectedDept)}
          onSelectStep={(step) => setSelectedStep(step)}
        />
      )}

      {(isAdmin || isManager) && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => {
              if (!selectedDept) {
                alert('Select a department first');
                return;
              }
              navigate(`/add-training-step?departmentID=${selectedDept}`);
            }}
          >
            Add Training Step
          </button>
          <button
            onClick={() => {
              if (!selectedStep) {
                alert('Select a training step first');
                return;
              }
              setEditFields(selectedStep);
              setEditModalOpen(true);
            }}
            disabled={!selectedStep}
          >
            Edit Training Step
          </button>
          <button>Delete Training Step</button>
        </div>
      )}

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Training Step</DialogTitle>
        <DialogContent
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginTop: 10,
          }}
        >
          <TextField
            label="Step"
            type="number"
            value={editFields.step ?? ''}
            onChange={(e) =>
              setEditFields({ ...editFields, step: parseInt(e.target.value) })
            }
          />
          <TextField
            label="Item"
            value={editFields.item ?? ''}
            onChange={(e) =>
              setEditFields({ ...editFields, item: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            value={editFields.description ?? ''}
            onChange={(e) =>
              setEditFields({ ...editFields, description: e.target.value })
            }
          />
          <TextField
            label="Trainee Expectation"
            multiline
            value={editFields.traineeExpectation ?? ''}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                traineeExpectation: e.target.value,
              })
            }
          />
          <TextField
            label="Trainer Expectation"
            multiline
            value={editFields.trainerExpectation ?? ''}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                trainerExpectation: e.target.value,
              })
            }
          />
          <TextField
            label="Training Duration"
            type="number"
            value={editFields.trainingDuration ?? ''}
            onChange={(e) =>
              setEditFields({
                ...editFields,
                trainingDuration: parseInt(e.target.value),
              })
            }
          />
          <TextField
            label="File Path"
            value={editFields.filePath ?? ''}
            onChange={(e) =>
              setEditFields({ ...editFields, filePath: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <button onClick={() => setEditModalOpen(false)}>Cancel</button>
          <button
            onClick={async () => {
              if (!selectedStep) return;
              try {
                await updateTrainingStep(selectedStep.stepID, {
                  ...selectedStep,
                  ...editFields,
                  lastModifiedBy: user.uid, // Make sure this is the correct field name
                });
                alert('Training step updated!');
                setEditModalOpen(false);
              } catch (err) {
                console.error('Update failed:', err);
                alert('Failed to update step.');
              }
            }}
          >
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
