import { useRef, useState, useEffect } from 'react';
import {
  DrillThrough,
  GroupingBar,
  Inject,
  PivotViewComponent,
  VirtualScroll,
} from '@syncfusion/ej2-react-pivotview';
import { registerLicense } from '@syncfusion/ej2-base';
import Papa from 'papaparse';

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

// Function to change the date to the first day of the month
const modifyOrderPlacedDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    date.setDate(1); // Set the date to the first of the month
    const isoString = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    return isoString;
  }
};

const transformCSV = (csvData) => {
  const parsedData = Papa.parse(csvData, { header: true });

  // Filter out rows where any value is missing
  const cleanedData = parsedData.data.filter((row) => {
    return Object.values(row).every(
      (value) => value !== undefined && value !== null && value.trim() !== ''
    );
  });

  const formattedData = cleanedData
    .map((row) => ({
      sku: row.sku,
      location: Math.random() < 0.5 ? 'Europe' : 'USA', // Randomly assign 'Europe' or 'USA'
      channel: row.channel,
      order_placed_date: modifyOrderPlacedDate(row.order_placed_date), // Set date to the first of the month
      quantity: parseFloat(row.quantity),
      revenue: parseFloat(row.revenue),
      id: parseInt(row.id, 10),
    }))
    .filter((row) => row.sku);
  return formattedData;
};

const DEFAULT_DATA_SOURCE_SETTINGS = {
  dataSource: [],
  filters: [PIVOT_DEFAULT_SETTINGS.location],
  formatSettings: [{ format: '###' }],
  columns: [PIVOT_DEFAULT_SETTINGS.month],
  rows: [PIVOT_DEFAULT_SETTINGS.channel, PIVOT_DEFAULT_SETTINGS.sku],
  values: [PIVOT_DEFAULT_SETTINGS.quantity],
  showSubTotals: false,
  showGrandTotals: false,
};

function App() {
  const pivotRef = useRef(null);
  const [isAggregatedModalOpen, setIsAggregatedModalOpen] = useState(false);
  const [currentAggregatedCell, setCurrentAggregatedCell] = useState(null);
  const [dataSourceSettings, setDataSourceSettings] = useState(
    DEFAULT_DATA_SOURCE_SETTINGS
  );

  useEffect(() => {
    // This fetch simulates loading the CSV file from a public source or file input.
    fetch('/src/assets/demand.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const data = transformCSV(csvText);
        setDataSourceSettings({
          ...DEFAULT_DATA_SOURCE_SETTINGS,
          dataSource: data,
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

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
            const updatedData = dataSourceSettings.dataSource.map(
              (r, index) => {
                const copy = { ...r };
                if (affectedIndices.includes(index)) {
                  const editIndex = affectedIndices.indexOf(index);
                  copy.quantity = editedRows[editIndex].quantity;
                }
                return copy;
              }
            );

            if (pivotRef?.current?.dataSourceSettings) {
              setDataSourceSettings({
                dataSource: updatedData,
                filters: pivotRef?.current?.dataSourceSettings.filters.map(
                  (f) => ({
                    name: f.properties.name,
                    caption: f.properties.caption,
                  })
                ),
                formatSettings: [{ format: '###' }],
                columns: pivotRef?.current?.dataSourceSettings.columns.map(
                  (c) => ({
                    name: c.properties.name,
                    caption: c.properties.caption,
                  })
                ),
                rows: pivotRef?.current?.dataSourceSettings.rows.map((r) => ({
                  name: r.properties.name,
                  caption: r.properties.caption,
                })),
                values: [PIVOT_DEFAULT_SETTINGS.quantity],
                showSubTotals: false,
                showGrandTotals: false,
              });
            }
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
