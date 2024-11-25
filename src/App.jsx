import { useRef, useState } from 'react';
import { dummyData } from './data';
import {
  PivotViewComponent,
  Inject,
  GroupingBar,
  VirtualScroll,
  DrillThrough,
} from '@syncfusion/ej2-react-pivotview';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE);

import './App.css';
import AggregatedEditModal from './AggregatedEditModal';
// import SyncFusion from './components/SyncFusion';

function App() {
  const pivotRef = useRef(null);
  const [data, setData] = useState(dummyData);
  const [isAggregatedModalOpen, setIsAggregatedModalOpen] = useState(false);
  const [currentAggregatedCell, setCurrentAggregatedCell] = useState(null);

  const gridSettings = {
    allowSelection: true,
    selectionSettings: { mode: 'Cell', type: 'Single' },
    rowHeight: 25,
    allowResizing: false,
  };

  const dataSourceSettings = {
    dataSource: data,
    columns: [
      { name: 'order_placed_date', caption: 'Date', showRemoveIcon: true },
      { name: 'channel', caption: 'Channel', showRemoveIcon: true },
    ],
    filters: [
      { name: 'location', caption: 'Location', showRemoveIcon: true },
      { name: 'channel', caption: 'Channel', showRemoveIcon: true },
      { name: 'sku', caption: 'SKU', showRemoveIcon: true },
    ],
    formatSettings: [{ format: '###' }],
    rows: [
      { name: 'location', caption: 'Location', showRemoveIcon: true },
      { name: 'sku', caption: 'SKU', showRemoveIcon: true },
    ],
    values: [
      {
        name: 'quantity',
        caption: 'Quantity',
        showRemoveIcon: false,
      },
    ],
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
    }
    // else continue as usual
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
        showFieldList={true}
        gridSettings={gridSettings}
        enableValueSorting={true}
        allowExcelExport={true}
        aggregateTypes={['Sum']}
        editSettings={editSettings}
      >
        <Inject services={[GroupingBar, VirtualScroll, DrillThrough]} />
      </PivotViewComponent>

      {isAggregatedModalOpen && (
        <AggregatedEditModal
          open={isAggregatedModalOpen}
          onClose={() => setIsAggregatedModalOpen(false)}
          onSave={() => {}}
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
