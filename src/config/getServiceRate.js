// // getServiceRate.js

// import api from '@/config/api'

// export const getServiceRate = async ({
//   serviceType,
//   container,
//   containerRow,
// }) => {
//   let prefix = ''

//   if (serviceType === 'TRANSPORT') {
//     prefix = 'TRP'
//   } else if (serviceType === 'STORAGE') {
//     prefix = 'STG'
//   } else if (serviceType === 'HIRE') {
//     prefix = 'HIR'
//   }

//   const size = String(
//     container.size || ''
//   )
//     .replace(/FT/i, '')
//     .trim()
//     .toUpperCase()

//   const type = String(
//     container.item || ''
//   )
//     .trim()
//     .toUpperCase()

//   let itemCode = ''

//   /*
//    * TRANSPORT
//    */
//   if (serviceType === 'TRANSPORT') {
//     const cartage = String(
//       containerRow.cartage_type || ''
//     )
//       .trim()
//       .toUpperCase()

//     const trip = String(
//       containerRow.trip_type || ''
//     )
//       .split(/\s+/)
//       .map(
//         word =>
//           word?.[0]?.toUpperCase() || ''
//       )
//       .join('')

//     const zone = String(
//       containerRow.zone || ''
//     )
//       .toUpperCase()
//       .replace(/^ZONE\s*/i, 'Z')

//     itemCode =
//       `${prefix}-${cartage}-${size}${type}-${trip}-${zone}`
//   }

//   /*
//    * STORAGE
//    */
//   else if (serviceType === 'STORAGE') {
//     const ownerType =
//   String(
//     container.container_number ||
//     container.name ||
//     ''
//   ).startsWith('CSL')
//     ? 'COC'
//     : 'SOC'

//     itemCode =
//       `${prefix}-${ownerType}-${size}${type}`
//   }

//   /*
//    * HIRE
//    */
//   else if (serviceType === 'HIRE') {
//     const ownerType =
//   String(
//     container.container_number ||
//     container.name ||
//     ''
//   ).startsWith('CSL')
//     ? 'COC'
//     : 'SOC'
    

//     itemCode =
//       `${prefix}-${ownerType}-${size}${type}`
//   }

//   console.log(
//     'Searching Item:',
//     itemCode
//   )

//   try {
//     const response =
//       await api.get(
//         `/resource/Item/${itemCode}`
//       )

//     return {
//       item_code: itemCode,
//       rate:
//         Number(
//           response.data.data
//             ?.valuation_rate
//         ) || 0,
//     }
//   } catch (error) {
//     console.error(
//       'Item not found:',
//       itemCode
//     )

//     return {
//       item_code: '',
//       rate: 0,
//     }
//   }
// }
// getServiceRate.js

import api from '@/config/api'

export const getServiceRate = async ({
  serviceType,
  container,
  containerRow = {},
}) => {
  let prefix = ''

  if (serviceType === 'TRANSPORT') {
    prefix = 'TRP'
  } else if (serviceType === 'STORAGE') {
    prefix = 'STG'
  } else if (serviceType === 'HIRE') {
    prefix = 'HIR'
  }

  const size = String(
    container.size || ''
  )
    .replace(/FT/i, '')
    .trim()
    .toUpperCase()

  const type = String(
    container.item ||
      container.type ||
      ''
  )
    .trim()
    .toUpperCase()

  let itemCode = ''

  /*
   * TRANSPORT
   */
  if (serviceType === 'TRANSPORT') {
    const cartage = String(
      containerRow.cartage_type || ''
    )
      .trim()
      .toUpperCase()

    const trip = String(
      containerRow.trip_type || ''
    )
      .split(/\s+/)
      .map(
        (word) =>
          word?.[0]?.toUpperCase() || ''
      )
      .join('')

    const zone = String(
      containerRow.zone || ''
    )
      .toUpperCase()
      .replace(/^ZONE\s*/i, 'Z')

    itemCode =
      `${prefix}-${cartage}-${size}${type}-${trip}-${zone}`
  }

  /*
   * STORAGE
   */
  else if (serviceType === 'STORAGE') {
    const ownerType =
      String(
        container.container_number ||
          container.name ||
          ''
      ).startsWith('CSL')
        ? 'COC'
        : 'SOC'

    itemCode =
      `${prefix}-${ownerType}-${size}${type}`
  }

  /*
   * HIRE
   */
  else if (serviceType === 'HIRE') {
    const ownerType =
      String(
        container.container_number ||
          container.name ||
          ''
      ).startsWith('CSL')
        ? 'COC'
        : 'SOC'

    itemCode =
      `${prefix}-${ownerType}-${size}${type}`
  }

  console.log(
    'Searching Item:',
    itemCode
  )

  try {
    const response =
      await api.get(
        `/resource/Item/${itemCode}`
      )

    return {
      item_code: itemCode,
      rate:
        Number(
          response.data.data
            ?.valuation_rate
        ) || 0,
    }
  } catch (error) {
    console.error(
      'Item not found:',
      itemCode
    )

    return {
      item_code: '',
      rate: 0,
    }
  }
}