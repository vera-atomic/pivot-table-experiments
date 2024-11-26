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
  const initialRowsCopy = currentAggregatedCell.rawData.map((r, index) => ({
    ...r,
    id: index,
  }));

  const [editedRows, setEditedRows] = useState(initialRowsCopy);
  const [aggValue, setAggValue] = useState(
    currentAggregatedCell.currentCell.actualValue
  );

  const DEFAULT_COLUMN_SETTINGS = [
    {
      field: 'sku',
      headerName: 'SKU',
      width: 200,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 150,
    },
  ];

  const customColumns = Object.keys(currentAggregatedCell.rawData[0])
    .filter((k) => !DEFAULT_COLUMN_SETTINGS.map((c) => c.field).includes(k))
    .filter((colField) => {
      const gridColDetails = currentAggregatedCell.gridColumns.find(
        (c) => c.field === colField
      );
      return gridColDetails.visible;
    })
    .map((colField) => {
      const gridColDetails = currentAggregatedCell.gridColumns.find(
        (c) => c.field === colField
      );
      return {
        field: colField,
        headerName: gridColDetails.headerText,
        width: gridColDetails.width,
      };
    });

  const columns = [...DEFAULT_COLUMN_SETTINGS, ...customColumns];

  const adjustRows = () => {
    const oldAggValue = currentAggregatedCell.currentCell.actualValue;
    // To deal with potential rounding discrepancies
    let editedRowsTotal = 0;

    const updatedRows = editedRows.map((r, index) => {
      const copy = { ...r };
      const oldRatio =
        currentAggregatedCell.rawData[index].quantity / oldAggValue;
      copy.quantity = Math.round(oldRatio * aggValue);
      editedRowsTotal += copy.quantity;
      return copy;
    });

    const difference = aggValue - editedRowsTotal;

    if (difference !== 0) {
      // Find the row with the lowest quantity if the difference is positive, or the highest if negative
      let rowToAdjustIndex = 0;
      let compareValue = difference > 0 ? Infinity : -Infinity;

      updatedRows.forEach((row, index) => {
        if (
          (difference > 0 && row.quantity < compareValue) ||
          (difference < 0 && row.quantity > compareValue)
        ) {
          rowToAdjustIndex = index;
          compareValue = row.quantity;
        }
      });

      // recompute to be sure
      editedRowsTotal -= updatedRows[rowToAdjustIndex].quantity;

      // Apply the difference to the chosen row, ensuring it doesn't go below zero
      updatedRows[rowToAdjustIndex].quantity = Math.max(
        updatedRows[rowToAdjustIndex].quantity + difference,
        0
      );

      editedRowsTotal += updatedRows[rowToAdjustIndex].quantity;
    }

    setEditedRows(updatedRows);
    // just to make sure, in case our difference distribution didn't go as expected, that the aggValue
    // always shows the sum of all rows
    setAggValue(editedRowsTotal);
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

            <Tooltip title="Adjust aggregated values, and see how underlying rows will proportionately update.">
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
              Adjust the aggregated value:
            </Typography>
            <Input
              type="number"
              value={aggValue}
              onChange={(event) => {
                setAggValue(Number(event.target.value));
              }}
              aria-labelledby="bulk-value-label"
              sx={{ width: '150px' }}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  e.target.blur();
                }
              }}
              onBlur={adjustRows}
            />
          </div>

          <div
            style={{
              height: 400,
              width: '100%',
              marginBottom: '16px',
            }}
          >
            <DataGridPro rows={editedRows} columns={columns} />
          </div>

          <Sheet sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => onSave(editedRows)}
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
