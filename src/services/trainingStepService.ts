// interface representing a training step object
export interface TrainingStep {
  stepID: number;
  step: number;
  item: string;
  description: string;
  traineeExpectation: string;
  trainerExpectation: string;
  trainingDuration: number;
  filePath: string;
  isCompleted: boolean;
  isSignedOff: boolean;
  lastModifiedBy: number;
}

//url for the training step endpoints
const API_BASE = 'https://localhost:44342/api/TrainingSteps';

//gets training steps by department and formats them for the MUI grid
export const GetFormattedStepsByDepartment = async (
  departmentId: number
): Promise<any[]> => {
  const res = await fetch(`${API_BASE}/by-department/${departmentId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch by department: ${res.status}`);
  }
  const data: TrainingStep[] = await res.json();
  return data.map((step, index) => ({
    id: index + 1,
    ...step,
  }));
};

//get all training steps in DB
export const GetAllTrainingSteps = async (): Promise<TrainingStep[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch training steps: ${res.status}`);
  }
  return await res.json();
};

//get training steps by department
export const GetTrainingStepsByDepartment = async (
  departmentId: number
): Promise<TrainingStep[]> => {
  const res = await fetch(`${API_BASE}/by-department/${departmentId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch by department: ${res.status}`);
  }
  return await res.json();
};

// deletes selected training step by id
export const DeleteTrainingStep = async (stepId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${stepId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete training step: ${res.status}`);
  }
};

//gets a single training step by id
export const GetTrainingStepById = async (
  id: number,
  token?: string
): Promise<TrainingStep> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch training step by id: ${res.status}`);
  }

  return await res.json();
};

//updates a training step that was selected by its id
export const UpdateTrainingStep = async (
  id: number,
  updatedStep: TrainingStep,
  token?: string
): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(updatedStep),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to update training step: ${res.status} - ${errorText}`
    );
  }
};

//deletes a training step by id. may be redundant with DeleteTrainingStep function??
export const deleteTrainingStep = async (stepId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${stepId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete training step: ${res.status}`);
  }
};

//creates a training book with a list of training steps for a specific user and department
export async function CreateTrainingBookWithSteps(
  userId: number,
  departmentId: number,
  stepIds: number[]
) {
  const response = await fetch(
    'https://localhost:44342/api/UserTrainingBooks/create-with-steps',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: userId,
        departmentID: departmentId,
        stepIDs: stepIds,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
}
