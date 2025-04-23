import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UsersPage {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

interface Department {
  departmentID: number;
  departmentName: string;
}

interface Roles {
  roleID: number;
  roleName: string;
}

const AddUsersPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<UsersPage>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );

  const [roles, setRoles] = useState<Roles[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('https://localhost:44342/api/Departments');
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments', err);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch('https://localhost:44342/api/Roles');
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error('Failed to load roles', err);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDepartment) {
      alert('Please select a department.');
      return;
    }

    if (!selectedRole) {
      alert('Please select a role.');
      return;
    }
    
    const payload = {
      ...form,
      departmentID: selectedDepartment,
      roleID: selectedRole,
    };

    try {
      const registerResponse = await fetch(
        'https://localhost:44342/api/Auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!registerResponse.ok) throw new Error('Failed to register user');

      alert('User added and assigned!');
      navigate(-1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Add New User</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle}
        />

        <select
          value={selectedDepartment ?? ''}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
          style={inputStyle}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.departmentID} value={dept.departmentID}>
              {dept.departmentName}
            </option>
          ))}
        </select>
        <select
          value={selectedRole ?? ''}
          onChange={(e) => setSelectedRole(Number(e.target.value))}
          style={inputStyle}
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.roleID} value={role.roleID}>
              {role.roleName}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={buttonStyle}>
            Add User
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={cancelButtonStyle}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

export default AddUsersPage;
