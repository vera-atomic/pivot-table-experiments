import { useRef, useState } from 'react';
import { dummyData } from './data';
import {
  DrillThrough,
  GroupingBar,
  Inject,
  PivotViewComponent,
  VirtualScroll,
} from '@syncfusion/ej2-react-pivotview';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE);

import './App.css';
import AggregatedEditModal from './AggregatedEditModal';

const PIVOT_DEFAULT_SETTINGS = {
  sku: { name: 'sku', caption: 'SKU' },
  month: { name: 'order_placed_date', caption: 'Month' },
  quantity: { name: 'quantity', caption: 'Quantity' },
  location: { name: 'location', caption: 'Location' },
  channel: { name: 'channel', caption: 'Channel' },
};

function App() {
  const pivotRef = useRef(null);
  const [data, setData] = useState(dummyData);
  const [isAggregatedModalOpen, setIsAggregatedModalOpen] = useState(false);
  const [currentAggregatedCell, setCurrentAggregatedCell] = useState(null);
  const [columnSettings, setColumnSettings] = useState([
    PIVOT_DEFAULT_SETTINGS.month,
  ]);
  const [rowSettings, setRowSettings] = useState([PIVOT_DEFAULT_SETTINGS.sku]);
  const [filterSettings, setFilterSettings] = useState([
    PIVOT_DEFAULT_SETTINGS.location,
    PIVOT_DEFAULT_SETTINGS.channel,
  ]);

  const groupingSettings = {
    showRemoveIcon: false,
    showValueTypeIcon: false,
  };

  const gridSettings = {
    allowSelection: true,
    selectionSettings: { mode: 'Cell', type: 'Single' },
    rowHeight: 25,
    allowResizing: false,
  };

  const dataSourceSettings = {
    dataSource: data,
    filters: filterSettings,
    formatSettings: [{ format: '###' }],
    columns: columnSettings,
    rows: rowSettings,
    values: [PIVOT_DEFAULT_SETTINGS.quantity],
    showSubTotals: false,
    showGrandTotals: false,
  };

  const editSettings = {
    allowDeleting: true,
    allowEditing: true,
    allowInlineEditing: true,
    mode: 'Normal',
  };

  const handleGetData = () => {
    if (pivotRef?.current) {
      const pivotDataString = pivotRef?.current.getPersistData();
      const parsed = JSON.parse(pivotDataString);
      console.warn(parsed.dataSourceSettings.dataSource);
    }
  };

  const drillThrough = (args) => {
    // we clicked on an aggregated cell
    if (args.rawData.length > 1) {
      args.cancel = true;
      setIsAggregatedModalOpen(true);
      setCurrentAggregatedCell(args);
    }
    // else continue as usual
  };

  const onModalClose = () => {
    setIsAggregatedModalOpen(false);
  };

  const onFieldDropped = (args) => {
    // TO DO: still some bugs when reordering agg col and row order
    const newField = {
      name: args.droppedField.name,
      caption: args.droppedField.caption,
    };

    if (args.droppedAxis === 'columns') {
      const newField = {
        name: args.droppedField.name,
        caption: args.droppedField.caption,
      };
      let newColumns = [];
      if (args.droppedPosition !== -1) {
        const pre = dataSourceSettings.columns.slice(0, args.droppedPosition);
        const post = dataSourceSettings.columns.slice(args.droppedPosition);
        newColumns = [...pre, newField, ...post];
      } else {
        newColumns = [...dataSourceSettings.columns, newField];
      }
      setColumnSettings(newColumns);
      setFilterSettings(
        args.dataSourceSettings.filters.map((f) => ({
          name: f.name,
          caption: f.caption,
        }))
      );
      return;
    }

    if (args.droppedAxis === 'rows') {
      let newRows = [];
      if (args.droppedPosition !== -1) {
        const pre = dataSourceSettings.rows.slice(0, args.droppedPosition);
        const post = dataSourceSettings.rows.slice(args.droppedPosition);
        newRows = [...pre, newField, ...post];
      } else {
        newRows = [...dataSourceSettings.rows, newField];
      }
      setRowSettings(newRows);
      setFilterSettings(
        args.dataSourceSettings.filters.map((f) => ({
          name: f.name,
          caption: f.caption,
        }))
      );
      return;
    }

    // Removing a column or row aggregation
    if (args.droppedAxis === 'filters') {
      setColumnSettings(
        args.dataSourceSettings.columns.map((c) => ({
          name: c.name,
          caption: c.caption,
        }))
      );
      setRowSettings(
        args.dataSourceSettings.rows.map((r) => ({
          name: r.name,
          caption: r.caption,
        }))
      );
      setFilterSettings(
        args.dataSourceSettings.filters.map((f) => ({
          name: f.name,
          caption: f.caption,
        }))
      );
      return;
    }

    // Dropping in an unsupported area
    if (!args.droppedAxis) {
      setFilterSettings((curr) => [
        ...curr.map((f) => ({ name: f.name, caption: f.caption })),
        newField,
      ]);
      return;
    }
  };

  return (
    <div>
      <PivotViewComponent
        allowDrillThrough={true}
        drillThrough={(args) => drillThrough(args)}
        ref={pivotRef}
        id="PivotViewReviewAndPublish"
        enableVirtualization={true}
        dataSourceSettings={dataSourceSettings}
        height="480px"
        showGroupingBar={true}
        gridSettings={gridSettings}
        enableValueSorting={true}
        aggregateTypes={['Sum']}
        editSettings={editSettings}
        groupingBarSettings={groupingSettings}
        onFieldDropped={onFieldDropped}
      >
        <Inject services={[GroupingBar, VirtualScroll, DrillThrough]} />
      </PivotViewComponent>

      {isAggregatedModalOpen && (
        <AggregatedEditModal
          open={isAggregatedModalOpen}
          onClose={() => setIsAggregatedModalOpen(false)}
          onSave={(editedRows) => {
            const affectedIndices = Object.values(
              currentAggregatedCell.currentCell.indexObject
            );
            const updatedData = data.map((r, index) => {
              const copy = { ...r };
              if (affectedIndices.includes(index)) {
                const editIndex = affectedIndices.indexOf(index);
                copy.quantity = editedRows[editIndex].quantity;
              }
              return copy;
            });
            setData(updatedData);
            setCurrentAggregatedCell(null);
            onModalClose();
          }}
          currentAggregatedCell={currentAggregatedCell}
        />
      )}

      <button style={{ marginTop: '2rem' }} onClick={handleGetData}>
        Get Pivot Data
      </button>
    </div>
  );
}

export default App;
