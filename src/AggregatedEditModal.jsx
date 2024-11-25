import { useState } from 'react';
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Sheet,
  Input,
  Tooltip,
  IconButton,
} from '@mui/joy';
import InfoIcon from '@mui/icons-material/Info';
import { DataGridPro } from '@mui/x-data-grid-pro';

function AggregatedEditModal({ open, onClose, currentAggregatedCell, onSave }) {
  const [editedData, setEditedData] = useState([]);
  const [newBulkValue, setNewBulkValue] = useState(0);

  // Handle row update
  const handleProcessRowUpdate = (updatedRow) => {
    setEditedData((prevRows) =>
      prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const columns = [
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'order_placed_date',
      headerName: 'Date',
      width: 180,
      editable: true,
    },
    {
      field: 'channel',
      headerName: 'Channel',
      width: 180,
      editable: true,
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 150,
      editable: true,
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 200,
      editable: true,
    },
  ];

  // Handle saving the updated data
  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog size="lg" variant="outlined">
        <Sheet>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'left',
            }}
          >
            <Typography level="h4" component="h2">
              Bulk Update Preview
            </Typography>

            <Tooltip title="You can preview here how editing the aggregated value will change the rows that compose it.">
              <IconButton
                size="sm"
                variant="plain"
                color="neutral"
                sx={{ ml: 1 }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0 24px 0',
            }}
          >
            <Typography level="body2" id="bulk-value-label" sx={{ mr: 1 }}>
              Adjust the bulk value:
            </Typography>
            <Input
              type="number"
              value={newBulkValue}
              onChange={() => {}}
              aria-labelledby="bulk-value-label"
              sx={{ width: '150px' }}
            />
          </div>

          <div
            style={{
              height: 400,
              width: '100%',
              marginBottom: '16px',
              maxHeight: '200px',
            }}
          >
            <DataGridPro
              rows={editedData}
              columns={columns}
              processRowUpdate={handleProcessRowUpdate}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>

          <Sheet sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Sheet>
        </Sheet>
      </ModalDialog>
    </Modal>
  );
}

export default AggregatedEditModal;
