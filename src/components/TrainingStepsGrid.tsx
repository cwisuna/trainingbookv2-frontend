import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  getFormattedTrainingStepsByDepartment,
  TrainingStep,
  deleteTrainingStep,
} from '../services/trainingStepService';
import { useAuth } from '../context/AuthContext';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TrainingGridProps {
  departmentId: number;
  trainingStepsOverride?: TrainingStep[];
  onSelectStep?: (step: TrainingStep) => void;
  onStepsLoaded?: (steps: TrainingStep[]) => void;
  userRole?: string[];
}

const TrainingGrid: React.FC<TrainingGridProps> = ({
  departmentId,
  trainingStepsOverride,
  onSelectStep,
  onStepsLoaded,
}) => {
  const { user } = useAuth();
  const isTrainerOrTrainee =
    user && !user.role.includes('Admin') && !user.role.includes('Manager');
  const isManager = user && user.role.includes('Manager');

  const [rows, setRows] = useState<TrainingStep[]>([]);

  const handleDeleteStep = async (stepID: number) => {
    try {
      await deleteTrainingStep(stepID);
      setRows((prevRows) => prevRows.filter((step) => step.stepID !== stepID));
    } catch (error) {
      console.error('Failed to delete step:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'step', headerName: 'Step', width: 70 },
    { field: 'item', headerName: 'Item', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'traineeExpectation',
      headerName: 'Trainee Expectation',
      width: 200,
    },
    {
      field: 'trainerExpectation',
      headerName: 'Trainer Expectation',
      width: 200,
    },
    { field: 'trainingDuration', headerName: 'Duration (hrs)', width: 130 },
    {
      field: 'filePath',
      headerName: 'Reference',
      width: 150,
      renderCell: (params) => {
        const filePath = params.value;
        return filePath ? (
          <button
            onClick={() => window.electronAPI?.openFile(filePath)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Open File
          </button>
        ) : null;
      },
    },
    { field: 'lastModifiedBy', headerName: 'Added By', width: 120 },
    {
      field: 'dateAdded',
      headerName: 'Date Added',
      width: 150,
      valueGetter: () => new Date().toLocaleDateString(),
    },
  ];

  if (isTrainerOrTrainee) {
    columns.push(
      {
        field: 'trainerNotes',
        headerName: 'Trainer Notes',
        width: 200,
        renderCell: (params) => (
          <span style={{ fontStyle: 'italic', color: '#555' }}>
            {params.value || '—'}
          </span>
        ),
      },
      {
        field: 'traineeNotes',
        headerName: 'Trainee Notes',
        width: 200,
        renderCell: (params) => (
          <span style={{ fontStyle: 'italic', color: '#555' }}>
            {params.value || '—'}
          </span>
        ),
      }
    );
  }

  if (isManager) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteStep(params.row.stepID)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    });
  }

  useEffect(() => {
    if (trainingStepsOverride) {
      setRows(trainingStepsOverride);
      if (onStepsLoaded) onStepsLoaded(trainingStepsOverride);
      return;
    }

    if (!departmentId) return;

    const loadSteps = async () => {
      try {
        const formattedRows = await getFormattedTrainingStepsByDepartment(
          departmentId
        );
        setRows(formattedRows);
        if (onStepsLoaded) onStepsLoaded(formattedRows);
      } catch (err) {
        console.error('Error loading training steps:', err);
      }
    };

    loadSteps();
  }, [departmentId, trainingStepsOverride]);

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.stepID}
        onRowClick={(params) => {
          if (onSelectStep) onSelectStep(params.row);
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default TrainingGrid;
