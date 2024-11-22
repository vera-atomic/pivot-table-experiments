import { useRef } from 'react';
import { dummyData } from './data';
import {
  PivotViewComponent,
  Inject,
  GroupingBar,
  VirtualScroll,
} from '@syncfusion/ej2-react-pivotview';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE);

import './App.css';
// import SyncFusion from './components/SyncFusion';

function App() {
  const pivotRef = useRef(null);

  const gridSettings = {
    allowSelection: true,
    selectionSettings: { mode: 'Cell', type: 'Single' },
    rowHeight: 25,
    allowResizing: false,
  };

  const dataSourceSettings = {
    dataSource: dummyData,
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
    showConfirmDialog: true,
  };

  const handleGetData = () => {
    if (pivotRef?.current) {
      const pivotDataString = pivotRef?.current.getPersistData();
      const parsed = JSON.parse(pivotDataString);
      console.warn(parsed.dataSourceSettings.dataSource);
    }
  };

  return (
    <div>
      <PivotViewComponent
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
        // cellClick={(args) => console.warn(args)}
        editSettings={editSettings}
        allowValueEditing={false}
      >
        <Inject services={[GroupingBar, VirtualScroll]} />
      </PivotViewComponent>

      <button onClick={handleGetData}>Get Pivot Data</button>
    </div>
  );
}

export default App;