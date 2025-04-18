import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface TrainingStepForm {
  step: number;
  item: string;
  description: string;
  traineeExpectation: string;
  trainerExpectation: string;
  trainingDuration: number;
  filePath: string;
  isCompleted: boolean;
  isSignedOff: boolean;
}

const AddTrainingStepPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const departmentID = new URLSearchParams(location.search).get('departmentID');

  const [form, setForm] = useState<TrainingStepForm>({
    step: 1,
    item: '',
    description: '',
    traineeExpectation: '',
    trainerExpectation: '',
    trainingDuration: 0,
    filePath: '',
    isCompleted: false,
    isSignedOff: false,
  });

  const handleSubmit = async () => {
    if (!departmentID) {
      alert('No department selected.');
      return;
    }

    try {
      const response = await fetch(
        'https://localhost:44342/api/TrainingSteps',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            departmentID: parseInt(departmentID),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create training step');

      alert('Training step added!');
      navigate(-1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '20px' }}>Add Training Step</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label>Step:</label>
          <input
            type="number"
            value={form.step}
            onChange={(e) =>
              setForm({ ...form, step: parseInt(e.target.value) })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label>Item:</label>
          <input
            type="text"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={textAreaStyle}
          />
        </div>

        <div>
          <label>Trainee Expectation:</label>
          <textarea
            value={form.traineeExpectation}
            onChange={(e) =>
              setForm({ ...form, traineeExpectation: e.target.value })
            }
            style={textAreaStyle}
          />
        </div>

        <div>
          <label>Trainer Expectation:</label>
          <textarea
            value={form.trainerExpectation}
            onChange={(e) =>
              setForm({ ...form, trainerExpectation: e.target.value })
            }
            style={textAreaStyle}
          />
        </div>

        <div>
          <label>Training Duration (Hrs):</label>
          <input
            type="number"
            value={form.trainingDuration}
            onChange={(e) =>
              setForm({ ...form, trainingDuration: parseInt(e.target.value) })
            }
            style={inputStyle}
          />
        </div>

        <div>
          <label>File Path (optional):</label>
          <input
            type="text"
            value={form.filePath}
            onChange={(e) => setForm({ ...form, filePath: e.target.value })}
            style={inputStyle}
            readOnly
          />
          <button
            type="button"
            onClick={async () => {
              if (window.electronAPI?.selectFile) {
                const filePath = await window.electronAPI.selectFile();
                if (filePath) {
                  setForm({ ...form, filePath });
                }
              } else {
                alert('File selection is not available in this environment.');
              }
            }}
            style={{
              ...buttonStyle,
              marginTop: '8px',
              backgroundColor: '#28a745',
            }}
          >
            Add File Path
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label>
            <input
              type="checkbox"
              checked={form.isCompleted}
              onChange={(e) =>
                setForm({ ...form, isCompleted: e.target.checked })
              }
            />{' '}
            Completed
          </label>

          <label>
            <input
              type="checkbox"
              checked={form.isSignedOff}
              onChange={(e) =>
                setForm({ ...form, isSignedOff: e.target.checked })
              }
            />{' '}
            Signed Off
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleSubmit} style={buttonStyle}>
            Submit
          </button>
          <button onClick={() => navigate(-1)} style={cancelButtonStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const textAreaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '80px',
  resize: 'vertical',
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
};

export default AddTrainingStepPage;
