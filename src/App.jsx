import { useRef } from 'react';
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
  };

  const handleGetData = () => {
    if (pivotRef?.current) {
      const pivotDataString = pivotRef?.current.getPersistData();
      const parsed = JSON.parse(pivotDataString);
      console.warn(parsed.dataSourceSettings.dataSource);
    }
  };

  const drillThrough = (args) => {
    if (args.rawData.length > 1) {
      // args.cancel stops the default edit values modal to pop up which usually does when
      // we try to edit aggregated fields
      args.cancel = true;
      // this is the case where we've double clicked on an aggregated data cell
      // args will hold all the detail of all raw rows that are affecting that aggregated value
      // in the args.rawData array, we can cycle through and change the values here row by row
    }
    // out of this conditional is the case of when we're trying to edit a normal unit row cell
    // editing it automatically out of the box updates the aggregated values
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

      <button style={{ marginTop: '2rem' }} onClick={handleGetData}>
        Get Pivot Data
      </button>
    </div>
  );
}

export default App;
