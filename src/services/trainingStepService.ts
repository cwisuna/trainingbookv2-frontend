export interface TrainingStep {
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

const API_BASE = 'https://localhost:44342/api/TrainingSteps';

export const getFormattedStepsByDepartment = async (
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

export const fetchAllTrainingSteps = async (): Promise<TrainingStep[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch training steps: ${res.status}`);
  }
  return await res.json();
};

export const fetchTrainingStepsByDepartment = async (
  departmentId: number
): Promise<TrainingStep[]> => {
  const res = await fetch(`${API_BASE}/by-department/${departmentId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch by department: ${res.status}`);
  }
  return await res.json();
};

export const DeleteTrainingStep = async (stepId: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/${stepId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete training step: ${res.status}`);
  }
};
