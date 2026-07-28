import {
  quotationRules,
} from './quotation/quotationRules'

import {
  gateInRules,
} from './gateIn/gateInRules'

export const getOperationRules = (
  operation
) => {
  switch (operation) {
    case 'Quotation':
      return quotationRules

    case 'Gate In':
      return gateInRules

    default:
      return {}
  }
}