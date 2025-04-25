export interface Department {
  departmentID: number;
  departmentName: string;
}

const baseUrl = 'https://localhost:44342/api/departments';

export const GetDepartments = async (): Promise<Department[]> => {
  const response = await fetch(baseUrl);
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
};

export const AddDepartment = async (
  departmentName: string
): Promise<Department> => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ departmentName }),
  });

  if (!response.ok) throw new Error('Failed to add department');
  return response.json();
};

export const UpdateDepartment = async (
  departmentID: number,
  departmentName: string
): Promise<void> => {
  const response = await fetch(`${baseUrl}/${departmentID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ departmentName }),
  });

  if (!response.ok) throw new Error('Failed to update department');
};

export async function getUserDepartmentByUserId(userId: number) {
  const response = await fetch(`https://localhost:44342/api/Departments/by-userId${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching department: ${response.statusText}`);
  }

  const data = await response.json();
  return data as { departmentID: number; departmentName: string };
}


export const DeleteDepartment = async (departmentID: number): Promise<void> => {
  const response = await fetch(`${baseUrl}/${departmentID}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete department');
};
