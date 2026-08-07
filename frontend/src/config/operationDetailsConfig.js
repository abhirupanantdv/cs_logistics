const commonDocketFields = [
  {
    field: 'job_card_number',
    label: 'Job Card',
  },
  {
    field: 'creation',
    label: 'Created Date',
  },
  {
    field: 'ex_vessel',
    label: 'Vessel',
  },
  {
    field: 'voyage',
    label: 'Voyage',
  },
  {
    field: 'driver_name',
    label: 'Driver Name',
  },
  {
    field: 'truck_rego_no',
    label: 'Vehicle Registration Number',
  },
  {
    field: 'cargo_condition',
    label: 'Cargo Condition',
  },
  {
    field: 'client_name',
    label: 'Client Name',
  },
  {
    field: 'from_address',
    label: 'From',
  },
  {
    field: 'to_address',
    label: 'To',
  },
  {
    field: 'load_status',
    label: 'Load Status',
  },
]

export const operationDetailsConfig = {
  'Gate In': [
    // {
    //   field: 'name',
    //   label: 'Gate In No',
    // },
    {
      field: 'job_card',
      label: 'Job Card',
    },
    {
      field: 'customer',
      label: 'Customer',
    },
    {
      field: 'creation',
      label: 'Created Date',
    },
    {
      field: 'storage_start',
      label: 'Storage Started',
    },
  ],

  'Gate Out': [
    // {
    //   field: 'name',
    //   label: 'Gate Out No',
    // },
    {
      field: 'job_card',
      label: 'Job Card',
    },
    {
      field: 'customer',
      label: 'Customer',
    },
    {
      field: 'date',
      label: 'Gate Out Date',
    },
  ],

  'Sales Invoice': [
//   {
//     field: 'name',
//     label: 'Invoice No',
//   },
  {
    field: 'status',
    label: 'Status',
  },
  {
    field: 'customer',
    label: 'Customer',
  },
  {
    field: 'custom_container_job_card',
    label: 'Job Card',
  },
  {
    field: 'posting_date',
    label: 'Invoice Date',
  },
  {
    field: 'due_date',
    label: 'Due Date',
  },
//   {
//     field: 'currency',
//     label: 'Currency',
//   },
  {
    field: 'grand_total',
    label: 'Grand Total (PGK)',
  },
  {
    field: 'outstanding_amount',
    label: 'Outstanding Amount (PGK)',
  },
//   {
//     field: 'customer_address',
//     label: 'Billing Address',
//   },
],

  'Equipment Interchange Receipt': [
    // {
    //   field: 'name',
    //   label: 'EIR No',
    // },
    {
      field: 'job_card',
      label: 'Job Card',
    },
    {
      field: 'creation',
      label: 'Created Date',
    },

   
    {field: 'datetime_of_interchange',
        label: 'Date & Time of Interchange'
    },
    {field: 'agent',
        label: 'Agent'
    },
    {field: 'shipper',
        label: 'Shipper'
    },
    {field: 'seal_no',
        label: 'Seal No.'
    },
    {field: 'vesselvoyage',
        label: 'Vessel/Voyage'
    },
    {field: 'external_condition_of_container',
        label: 'External Condition Of Container'
    },
    {field: 'internal_condition_of_container',
        label: 'Internal Condition Of Container'
    },
     {field: 'container_load_status',
        label: 'Container Load Status'
    },
    {field: 'damage_annotation_image',
        label: 'Damage Annotation Image'
    },
    
  ],

  'Pickup Docket': [
    ...commonDocketFields.slice(0, 4),

    {
      field: 'pick_up_location',
      label: 'Pick Up Location',
    },
    {
      field: 'pick_up_time',
      label: 'Pick Up Time',
    },

    ...commonDocketFields.slice(4),
  ],

  'Delivery Docket': [
    ...commonDocketFields.slice(0, 4),

    {
      field: 'destination',
      label: 'Destination',
    },
    {
      field: 'delivery_date_time',
      label: 'Delivery Date & Time',
    },

    ...commonDocketFields.slice(4),
  ],
  Quotation: [
    // {
    //   field: 'name',
    //   label: 'Quotation No',
    // },
    {
      field: 'party_name',
      label: 'Customer',
    },
    {
      field: 'transaction_date',
      label: 'Quotation Date',
    },
    {
      field: 'valid_till',
      label: 'Valid Till',
    },
    // {
    //   field: 'grand_total',
    //   label: 'Grand Total (PGK)',
    // },
  ],
}