// import { useEffect, useRef } from 'react';
// import {
//   PivotViewComponent,
//   Inject,
//   GroupingBar,
//   VirtualScroll,
// } from '@syncfusion/ej2-react-pivotview';

// function SyncFusion({ data, pivotRef, setData, setHandleGetData }) {
//   //   useEffect(() => {
//   //     const handleGetData = () => {
//   //       if (pivotRef?.current) {
//   //         const pivotDataString = pivotRef?.current.getPersistData();
//   //         const parsed = JSON.parse(pivotDataString);
//   //         console.warn(parsed.dataSourceSettings.dataSource);
//   //       }
//   //     };
//   //     setHandleGetData(() => handleGetData);
//   //   }, [pivotRef]);

//   const gridSettings = {
//     allowSelection: true,
//     selectionSettings: { mode: 'Cell', type: 'Single' },
//     rowHeight: 25,
//     allowResizing: false,
//   };

//   const dataSourceSettings = {
//     dataSource: data,
//     columns: [
//       { name: 'order_placed_date', caption: 'Date', showRemoveIcon: true },
//       { name: 'channel', caption: 'Channel', showRemoveIcon: true },
//     ],
//     filters: [
//       { name: 'location', caption: 'Location', showRemoveIcon: true },
//       { name: 'channel', caption: 'Channel', showRemoveIcon: true },
//       { name: 'sku', caption: 'SKU', showRemoveIcon: true },
//     ],
//     formatSettings: [{ format: '###' }],
//     rows: [
//       { name: 'location', caption: 'Location', showRemoveIcon: true },
//       { name: 'sku', caption: 'SKU', showRemoveIcon: true },
//     ],
//     values: [
//       {
//         name: 'quantity',
//         caption: 'Quantity',
//         showRemoveIcon: false,
//       },
//     ],
//     showSubTotals: false,
//     showGrandTotals: false,
//   };

//   const editSettings = {
//     allowDeleting: true,
//     allowEditing: true,
//     mode: 'Dialog',
//   };

//   const handleCellClick = (args) => {
//     console.log('Cell clicked:', args);
//   };

//   return (
//     <div>
//       <PivotViewComponent
//         ref={pivotRef}
//         id="PivotViewReviewAndPublish"
//         enableVirtualization={true}
//         dataSourceSettings={dataSourceSettings}
//         height="480px"
//         showGroupingBar={true}
//         showFieldList={true}
//         gridSettings={gridSettings}
//         enableValueSorting={true}
//         allowExcelExport={true}
//         aggregateTypes={['Sum']}
//         cellClick={handleCellClick}
//         editSettings={editSettings}
//       >
//         <Inject services={[GroupingBar, VirtualScroll]} />
//       </PivotViewComponent>
//     </div>
//   );
// }

// export default SyncFusion;
