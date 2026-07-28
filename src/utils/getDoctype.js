//getDoctype.js
export function getDoctype(
  operation
) {
  switch (operation) {
    case 'Gate In':
        return 'Gate In'

    case 'Gate Out':
        return 'Gate Out'

    case 'Quotation':
      return 'Quotation'

    case 'Sales Invoice':
      return 'Sales Invoice'

    case 'Pickup & Delivery Docket':
      return 'Pickup and Delivery Docket'

    case 'Equipment Interchange Receipt':
      return 'Equipment Interchange Receipt'

    default:
      return null
  }
}