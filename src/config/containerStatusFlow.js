// src/constants/containerStatusFlow.js

export const allowedStatusFlow = {
  Available: [
    'Quoted',
    'Picked Up',
    'In Transit',
    'In Yard',
    'Rent',
  ],

  Quoted: [
    'Quoted',
    'Picked Up',
    'In Transit',
    'In Yard',
    'Available',
    'Rent',
  ],

  'Picked Up': [
    'In Transit',
    'In Yard',
    'Rent',
  ],

  'In Transit': [
    'Picked Up',
    'Delivered',
    'In Yard',
    'Available',
    'Rent',
  ],

  'In Yard': [
    'Invoiced',
    'Dispatched',
    'Delivered',
    'Available',
    'Rent',
  ],

  Invoiced: [
    'Dispatched',
    'Delivered',
    'In Transit',
    'Available',
  ],

  Dispatched: [
    'Delivered',
    'In Transit',
    'Invoiced',
    'Available',
  ],

  Delivered: [
    'Picked Up',
    'Invoiced',
    'In Transit',
    'Available',
  ],

  Rent: [
    'Available',
    'In Yard',
    'Invoiced',
  ],
}