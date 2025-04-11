import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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
  { field: 'duration', headerName: 'Duration (hrs)', width: 130 },
  { field: 'reference', headerName: 'Reference', width: 150 },
  { field: 'revisions', headerName: 'Revisions', width: 100 },
  { field: 'addedBy', headerName: 'Added By', width: 150 },
  { field: 'dateAdded', headerName: 'Date Added', width: 150 },
];

const rows: any[] = [];

const TrainingGrid: React.FC = () => {
  return (
    <div style={{ height: 400, width: '100%' }}>
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
