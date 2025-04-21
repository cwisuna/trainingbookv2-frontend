import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  GetTrainingStepsByDepartment,
  TrainingStep,
  GetFormattedStepsByDepartment,
} from '../services/trainingStepService';
import { on } from 'events';

interface TrainingGridProps {
  departmentId: number;
  onSelectStep?: (step: TrainingStep) => void;
  onStepsLoaded?: (steps: TrainingStep[]) => void;
}

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
    valueGetter: () => new Date().toLocaleDateString(), // Consider replacing with real data
  },
];

const TrainingGrid: React.FC<TrainingGridProps> = ({
  departmentId,
  onSelectStep,
  onStepsLoaded,
}) => {
  const [rows, setRows] = useState<TrainingStep[]>([]);

  useEffect(() => {
    setRows([]);

    if (!departmentId) return;

    const loadSteps = async () => {
      try {
        const formattedRows = await GetFormattedStepsByDepartment(departmentId);
        setRows(formattedRows);
        if (onStepsLoaded) {
          onStepsLoaded(formattedRows);
        }
      } catch (err) {
        console.error('Error loading training steps:', err);
      }
    };

    loadSteps();
  }, [departmentId]);

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
