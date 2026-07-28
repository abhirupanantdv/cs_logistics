// operationHelpers.js

import {
  SYSTEM_DEFAULT_FIELDS,
  isSystemReadOnlyField,
} from './operationDefaults'
import { getUser } from '@/utils/storage'

// operationHelpers.js

export const buildSections = (fields = []) => {
  const sections = []

  // Initialize a default starter section
  let currentSection = {
    label: 'General Information',
    fields: [],
  }

  fields.forEach((field) => {
    if (field.fieldtype === 'Section Break') {
      // Whenever we hit a Section Break, save the previous section if it has fields
      if (currentSection.fields.length > 0) {
        sections.push(currentSection)
      }

      // Start a brand new separate section bucket for the layout grid
      currentSection = {
        label: field.label || 'Additional Information',
        fields: [],
      }
      return
    }

    // Ignore Column Breaks so they don't leak as empty field rows
    if (field.fieldtype === 'Column Break') {
      return
    }

    currentSection.fields.push(field)
  })

  // Don't forget to push the final section
  if (currentSection.fields.length > 0) {
    sections.push(currentSection)
  }

  return sections
}

export const getERPDefaultValue = (
  field, currentUser
) => {
  if (!field?.default) return ''

  const loggedInUser =
    currentUser || getUser()

  const userEmail =
    typeof loggedInUser === 'string'
      ? loggedInUser
      : loggedInUser?.email || ''

  switch (field.default) {
    case 'Today':
      return new Date()
        .toISOString()
        .split('T')[0]

    case 'user':
    case 'User':
    case '__user':
      return userEmail

    default:
      return field.default
  }
}

export const buildInitialFormData = ({
  visibleFields,
  jobCard,
  operation,
  selectedContainers,
  jobCardField,
  currentUser,
}) => {
  const defaults = {}
 

  visibleFields.forEach(
    (field) => {
      const fieldname =
        field.fieldname

      /*
      ERP DEFAULTS
      */
      const erpDefault =
        getERPDefaultValue(
          field,
          currentUser
        )

      if (
        erpDefault !== undefined &&
        erpDefault !== null &&
        erpDefault !== ''
      ) {
        defaults[fieldname] =
          erpDefault
      }

//        console.log(
//   'FIELD DEFAULT',
//   field.fieldname,
//   field.default
// )

      /*
      SYSTEM DEFAULTS
      */
      if (
        SYSTEM_DEFAULT_FIELDS[
          fieldname
        ]
      ) {
        defaults[fieldname] =
          SYSTEM_DEFAULT_FIELDS[
            fieldname
          ].value
      }

      /*
      JOB CARD
      */
      if (
        fieldname ===
        jobCardField
      ) {
        defaults[fieldname] =
          jobCard?.name || ''
      }

      /*
      CUSTOMER
      */
      if (
        fieldname ===
          'customer' ||
        fieldname ===
          'party_name'
      ) {
        defaults[fieldname] =
          jobCard?.customer || ''
      }

      /*
      CUSTOMER NAME
      */
      if (
        fieldname ===
        'customer_name'
      ) {
        defaults[fieldname] =
          jobCard?.customer || ''
      }

      /*
TABLE FIELDS
*/
if (field.fieldtype === 'Table') {
  defaults[fieldname] = []
}

/*
CONTAINER FIELDS
Only populate normal fields,
never overwrite Table fields
*/
if (
  fieldname
    ?.toLowerCase()
    .includes(
      'container'
    ) &&
  fieldname !==
    jobCardField &&
  field.fieldtype !==
    'Table'
) {
  defaults[fieldname] =
    selectedContainers.join(
      ', '
    )
}
    }
  )

  /*
  QUOTATION SPECIFIC
  */
  if (
    operation ===
    'Quotation'
  ) {
    defaults.quotation_to =
      'Customer'

    defaults.company =
      'CS Logistics'

    defaults.currency =
      'PGK'

    defaults.selling_price_list =
      'Standard Selling'

    defaults.price_list_currency =
      'INR'

    defaults.plc_conversion_rate =
      '1.000000000'
  }

  return defaults
}

export const isFieldReadOnly = ({
  field,
  operation,
  jobCardField,
}) => {
  const fieldname =
    field.fieldname

  if (
    isSystemReadOnlyField(
      fieldname
    )
  ) {
    return true
  }

  if (
    fieldname ===
    jobCardField
  ) {
    return true
  }

  if (
    fieldname ===
      'customer' ||
    fieldname ===
      'party_name' ||
    fieldname ===
      'customer_name' ||
    fieldname ===
      'custom_from_location' ||
      fieldname ===
          'custom_to_location'
  ) {
    return true
  }

  if (
    operation ===
      'Quotation' &&
    fieldname ===
      'quotation_to'
  ) {
    return true
  }

  return false
}

export const fieldSupportsFullWidth =
  (fieldType) =>
    [
      'Text',
      'Small Text',
      'Text Editor',
      'Table',
    ].includes(fieldType)

export const getSectionIcon = (
  label = ''
) => {
  const text =
    label.toLowerCase()

  if (
    text.includes('customer') ||
    text.includes('client') ||
    text.includes('supplier')
  )
    return '👤'

  // Container specific emoji (Shipping Container / Package Box)
  if (
    text.includes('container')
  )
    return '📦'

  if (
    text.includes('location') ||
    text.includes('route') ||
    text.includes('trip')
  )
    return '📍'

  if (
    text.includes('currency') ||
    text.includes('pricing') ||
    text.includes('totals')
  )
    return '💰'

  if (
    text.includes('tax') ||
    text.includes('charge') ||
    text.includes('invoice')
  )
    return '🧾'

  if (
    text.includes('address') ||
    text.includes('company')
  )
    return '🏢'

  // Additional useful mappings for ERP sections:
  if (
    text.includes('date') ||
    text.includes('time') ||
    text.includes('schedule')
  )
    return '📅'

  if (
    text.includes('item') ||
    text.includes('product') ||
    text.includes('service')
  )
    return '🛒'

  if (
    text.includes('status') ||
    text.includes('setting') ||
    text.includes('config')
  )
    return '⚙️'

  if (
    text.includes('note') ||
    text.includes('term') ||
    text.includes('condition') ||
    text.includes('remark')
  )
    return '📝'

  return '📋'
}
