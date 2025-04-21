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

const AddUsersPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<UsersPage>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDepartment) {
      alert('Please select a department.');
      return;
    }

    try {
      const registerResponse = await fetch('https://localhost:44342/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!registerResponse.ok) throw new Error('Failed to register user');

      const { userId } = await registerResponse.json();

      const assignResponse = await fetch(
        `https://localhost:44342/api/Users/${userId}/assign-department/${selectedDepartment}`,
        {
          method: 'PUT',
        }
      );

      if (!assignResponse.ok) throw new Error('Failed to assign department');

      alert('User added and assigned!');
      navigate(-1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={selectedDepartment ?? ''}
          onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.departmentID} value={dept.departmentID}>
              {dept.departmentName}
            </option>
          ))}
        </select>

        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUsersPage;
