export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  userName: string;
  departmentID: number;
  departmentName: string;
}

export const getUsersByDepartment = async (
  departmentId: number
): Promise<User[]> => {
  const response = await fetch(
    `https://localhost:44342/api/ApplicationUsers/by-department/${departmentId}`
  );
  if (!response.ok) throw new Error('Failed to fetch users by department');
  return response.json();
};
