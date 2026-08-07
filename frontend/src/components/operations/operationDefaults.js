// operationDefaults.js

export const SYSTEM_DEFAULT_FIELDS = {
  company: {
    value: 'CS Logistics',
    readOnly: true,
  },

  currency: {
    value: 'PGK',
    readOnly: true,
  },

  selling_price_list: {
    value: 'Standard Selling',
    readOnly: true,
  },

  price_list_currency: {
    value: 'INR',
    readOnly: true,
  },

  plc_conversion_rate: {
    value: '1.000000000',
    readOnly: true,
  },

  quotation_to: {
    value: 'Customer',
    readOnly: true,
  },
}

export const ALWAYS_READONLY_FIELDS = [
  'custom_job_card',
  'job_card',
  'job_card_number',
  'custom_container_job_card',

  'party_name',
  'customer',

  'currency',
  'company',

  'selling_price_list',
  'price_list_currency',
  'plc_conversion_rate',

  'quotation_to',
]

export const getSystemDefaultValue = (
  fieldname
) => {
  return (
    SYSTEM_DEFAULT_FIELDS[fieldname]
      ?.value || null
  )
}

export const isSystemReadOnlyField = (
  fieldname
) => {
  return ALWAYS_READONLY_FIELDS.includes(
    fieldname
  )
}