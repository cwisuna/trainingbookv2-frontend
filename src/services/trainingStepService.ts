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

  trainerNotes?: string; // not sure if this is being passed
  columnNotes?: string; // not sure if this is being passed
}

//url for the training step endpoints
const API_BASE = 'https://localhost:44342/api/TrainingSteps';

//gets training steps by department and formats them for the MUI grid
export const getFormattedTrainingStepsByDepartment = async (
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
export const getAllTrainingSteps = async (): Promise<TrainingStep[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch training steps: ${res.status}`);
  }
  return await res.json();
};

//get training steps by department
export const getTrainingStepsByDepartment = async (
  departmentId: number
): Promise<TrainingStep[]> => {
  const res = await fetch(`${API_BASE}/by-department/${departmentId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch by department: ${res.status}`);
  }
  return await res.json();
};

//gets a single training step by id
export const getTrainingStepById = async (
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
export const updateTrainingStep = async (
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

// deletes selected training step by id
export const deleteTrainingStep = async (stepId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${stepId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete training step: ${res.status}`);
  }
};

//creates a training book with a list of training steps for a specific user and department
export async function createTrainingBookWithSteps(
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

export const getTrainingBookForTrainee = async () => {
  const response = await fetch(
    'https://localhost:44342/api/UserTrainingBooks/my-training-book',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch trainee training book');
  return response.json();
};
