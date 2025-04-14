import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  fetchTrainingStepsByDepartment,
  TrainingStep,
  getFormattedStepsByDepartment,
} from '../services/trainingStepService';

interface TrainingGridProps {
  departmentId: number;
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
  { field: 'filePath', headerName: 'Reference', width: 150 },
  { field: 'lastModifiedBy', headerName: 'Added By', width: 120 },
  {
    field: 'dateAdded',
    headerName: 'Date Added',
    width: 150,
    valueGetter: () => new Date().toLocaleDateString(),
  },
];

const TrainingGrid: React.FC<TrainingGridProps> = ({ departmentId }) => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    setRows([]);

    if (!departmentId) return;

    const loadSteps = async () => {
      try {
        const formattedRows = await getFormattedStepsByDepartment(departmentId);
        setRows(formattedRows);
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
