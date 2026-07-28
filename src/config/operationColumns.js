//operationColumns.js
export const operationColumns = {
  'Gate In': [
    {
      label: 'ID',
      field: 'name',
      width: '280px',
    },
    {
      label: 'Job Card No.',
      field: 'job_card',
      width: '220px',
    },
    {
      label: 'Customer',
      field: 'customer',
      width: '280px',
    },
    {
      label: 'Gate In Date & Time',
      field: 'creation',
      width: '260px',
    },
  ],

'Pickup Docket': [
  {
    label: 'ID',
    field: 'name',
    width: 'minmax(0, 1.4fr)',
  },
  {
    label: 'DOCKET TYPE',
    field: 'docket_type',
    width: 'minmax(0, 0.9fr)',
  },
  {
    label: 'JOB CARD NO.',
    field: 'job_card_number',
    width: 'minmax(0, 1.1fr)',
  },
  {
    label: 'DATE & TIME',
    field: 'creation',
    width: 'minmax(0, 1.3fr)',
  },
  {
    label: 'LOAD STATUS',
    field: 'load_status',
    width: 'minmax(0, 1fr)',
  },
  {
    label: 'VEHICLE NO.',
    field: 'truck_rego_no',
    width: 'minmax(0, 1fr)',
  },
  {
    label: 'DRIVER NAME',
    field: 'driver_name',
    width: 'minmax(0, 1.2fr)',
  },
],

'Delivery Docket': [
  {
    label: 'ID',
    field: 'name',
    width: 'minmax(0, 1.4fr)',
  },
  {
    label: 'DOCKET TYPE',
    field: 'docket_type',
    width: 'minmax(0, 0.9fr)',
  },
  {
    label: 'JOB CARD NO.',
    field: 'job_card_number',
    width: 'minmax(0, 1.1fr)',
  },
  {
    label: 'DATE & TIME',
    field: 'creation',
    width: 'minmax(0, 1.3fr)',
  },
  {
    label: 'LOAD STATUS',
    field: 'load_status',
    width: 'minmax(0, 1fr)',
  },
  {
    label: 'VEHICLE NO.',
    field: 'truck_rego_no',
    width: 'minmax(0, 1fr)',
  },
  {
    label: 'DRIVER NAME',
    field: 'driver_name',
    width: 'minmax(0, 1.2fr)',
  },
],

  'Equipment Interchange Receipt': [
  {
    label: 'ID',
    field: 'name',
    width: '180px',
  },
  {
    label: 'Job Card No.',
    field: 'job_card',
    width: '140px',
  },
  {
    label: 'Interchange Date & Time',
    field: 'datetime_of_interchange',
    width: '220px',
  },
  {
    label: 'Load Status',
    field: 'container_load_status',
    width: '140px',
  },
  {
    label: 'Vessel / Voyage',
    field: 'vesselvoyage',
    width: '180px',
  },
  {
    label: 'Shipper',
    field: 'shipper',
    width: '180px',
  },
  {
    label: 'Receiving Party',
    field: 'receiving_party',
    width: '180px',
  },
],

  Quotation: [
  {
    label: 'ID',
    field: 'name',
    width: '190px',
  },
  {
    label: 'JOB CARD NO.',
    field: 'custom_job_card',
    width: '140px',
  },
  {
    label: 'CUSTOMER',
    field: 'customer_name',
    width: '180px',
  },
  {
    label: 'DATE',
    field: 'creation',
    width: '220px',
  },
  {
    label: 'TOTAL QUOTED AMOUNT',
    field: 'grand_total',
    width: '180px',
  },
  {
    label: 'Status',
    field: 'status',
    width: '120px',
  },
],

  'Gate Out': [
    {
      label: 'ID',
      field: 'name',
      width: '280px',
    },
    {
      label: 'Job Card No.',
      field: 'job_card',
      width: '220px',
    },
    {
      label: 'Customer',
      field: 'customer',
      width: '280px',
    },
    {
      label: 'Gate Out Date & Time',
      field: 'creation',
      width: '260px',
    },
  ],
  'Sales Invoice': [
  {
    label: 'ID',
    field: 'name',
    width: '240px',
  },
  {
    label: 'Job Card No.',
    field: 'custom_container_job_card',
    width: '160px',
  },
  {
    label: 'Customer',
    field: 'customer',
    width: '180px',
  },
  {
    label: 'Date Created',
    field: 'creation',
    width: '180px',
  },
  {
    label: 'Due Date',
    field: 'due_date',
    width: '140px',
  },
  {
    label: 'Total Amount (PGK)',
    field: 'net_total',
    width: '140px',
  },
]

}

// export const expandableOperations = [
//   'Gate In',
//   'Gate Out',
//   'Sales Invoice',
// ]
