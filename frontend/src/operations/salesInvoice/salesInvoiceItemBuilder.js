// // salesInvoiceItembuilder.js
// import { getServiceRate } from '../../config/getServiceRate'

// export const buildSalesInvoiceItems =
//   async ({
//     jobCard,
//     containerDetails,
//   }) => {
//     const items = []

//     const operations =
//       jobCard.operations || []

//     const containerServices = {}

//     /*
//      * Build Service Map
//      */
//     for (const op of operations) {
//       if (!op.containers) continue

//       const container =
//         op.containers

//       if (
//         !containerServices[container]
//       ) {
//         containerServices[
//           container
//         ] = {
//           gate_ins: [],
//           gate_outs: [],
//           transports: [],
//           storage_start: false,

//           is_csl:
//             String(
//               container
//             ).startsWith('CSL'),
//         }
//       }

//       const service =
//         containerServices[container]

//       /*
//        * Gate In
//        */
//       if (
//         op.operation_name ===
//         'Gate In'
//       ) {
//         service.gate_ins.push({
//           date: op.time,
//           operation: op.operation,
//         })
//       }

//       /*
//        * Gate Out
//        */
//       if (
//         op.operation_name ===
//         'Gate Out'
//       ) {
//         service.gate_outs.push({
//           date: op.time,
//           operation: op.operation,
//         })
//       }

//       /*
//        * Transport
//        */
//       if (
//         [
//           'Pickup Docket',
//           'Delivery Docket',
//           'Pickup',
//           'Delivery',
//         ].includes(
//           op.operation_name
//         )
//       ) {
//         service.transports.push(op)
//       }
//     }

//     const jobContainers =
//       jobCard.container || []

//     for (const containerName of Object.keys(
//       containerServices
//     )) {
//       const service =
//         containerServices[
//           containerName
//         ]

//       const container =
//         containerDetails.find(
//           (c) =>
//             c.container_number ===
//               containerName ||
//             c.name === containerName
//         )

//       if (!container) continue

//       const jcRow =
//         jobContainers.find(
//           (row) =>
//             row.container ===
//             containerName
//         )

//       /*
//        * TRANSPORT ITEMS
//        */
//       for (const transport of service.transports) {
//         const transportRate =
//           await getServiceRate({
//             serviceType:
//               'TRANSPORT',
//             container,
//             containerRow: jcRow,
//           })

//         items.push({
//           item_code:
//             transportRate.item_code,

//           item_name:
//             transport.operation_name,

//           description:
//             `${transport.operation_name} - ${containerName}`,

//           qty: 1,

//           uom: 'Nos',

//           rate:
//             transportRate.rate,

//           amount:
//             transportRate.rate,
//         })
//       }

//       /*
//        * STORAGE ITEMS
//        */

//       const gateIns =
//         service.gate_ins.sort(
//           (a, b) =>
//             new Date(a.date) -
//             new Date(b.date)
//         )

//       const gateOuts =
//         service.gate_outs.sort(
//           (a, b) =>
//             new Date(a.date) -
//             new Date(b.date)
//         )

//       for (
//         let i = 0;
//         i < gateIns.length;
//         i++
//       ) {
//         const gateIn =
//           new Date(
//             gateIns[i].date
//           )

//         const gateOut =
//           gateOuts[i]
//             ? new Date(
//                 gateOuts[i].date
//               )
//             : null

//         if (!gateOut)
//           continue

//         const days =
//           Math.ceil(
//             (gateOut - gateIn) /
//               (1000 *
//                 60 *
//                 60 *
//                 24)
//           )

//         if (days <= 0)
//           continue

//         const storageRate =
//           await getServiceRate({
//             serviceType:
//               'STORAGE',
//             container,
//             containerRow: jcRow,
//           })

//         items.push({
//           item_code:
//             storageRate.item_code,

//           item_name:
//             'Container Storage per day Charge',

//           description:
//             `${containerName}: ${gateIns[i].date} To ${gateOuts[i].date}`,

//           qty: days,

//           uom: 'Nos',

//           rate:
//             storageRate.rate,

//           amount:
//             days *
//             storageRate.rate,
//         })
//       }

//       /*
//        * CSL HIRE
//        */

//       if (
//         service.is_csl
//       ) {
//         for (
//           let i = 0;
//           i <
//           gateOuts.length;
//           i++
//         ) {
//           const gateOut =
//             new Date(
//               gateOuts[i].date
//             )

//           const nextGateIn =
//             gateIns[i + 1]
//               ? new Date(
//                   gateIns[
//                     i + 1
//                   ].date
//                 )
//               : new Date()

//           const hireDays =
//             Math.ceil(
//               (nextGateIn -
//                 gateOut) /
//                 (1000 *
//                   60 *
//                   60 *
//                   24)
//             )

//           if (
//             hireDays <= 0
//           )
//             continue

//           const hireRate =
//             await getServiceRate({
//               serviceType:
//                 'HIRE',
//               container,
//               containerRow:
//                 jcRow,
//             })

//           items.push({
//             item_code:
//               hireRate.item_code,

//             item_name:
//               'Container Hire',

//             description:
//               `${containerName}: ${gateOuts[i].date} To ${
//                 gateIns[
//                   i + 1
//                 ]
//                   ? gateIns[
//                       i + 1
//                     ].date
//                   : 'Today'
//               }`,

//             qty: hireDays,

//             uom: 'Nos',

//             rate:
//               hireRate.rate,

//             amount:
//               hireDays *
//               hireRate.rate,
//           })
//         }
//       }
//     }

//     return items
//   }
// salesInvoiceItembuilder.js
import { getServiceRate } from '../../config/getServiceRate'
import {getOperationRecordDetails} from '@/services/operationTypeService'

export const buildSalesInvoiceItems =
  async ({
    jobCard,
    containerDetails,
  }) => {
    const items = []

    const operations =
      jobCard.operations || []

    const containerServices = {}

    /*
     * Build Service Map
     */
    for (const op of operations) {
      if (!op.containers) continue

      const container =
        op.containers

      if (
        !containerServices[container]
      ) {
        containerServices[
          container
        ] = {
          gate_ins: [],
          gate_outs: [],
          transports: [],
          storage_start: false,

          is_csl:
            String(
              container
            ).startsWith('CSL'),
        }
      }

      const service =
        containerServices[container]

      /*
       * Gate In
       */
      if (
        op.operation_name ===
        'Gate In'
      ) {
        service.gate_ins.push({
          date: op.time,
          operation: op.operation,
        })
      }

      /*
       * Gate Out
       */
      if (
        op.operation_name ===
        'Gate Out'
      ) {
        service.gate_outs.push({
          date: op.time,
          operation: op.operation,
        })
      }

      /*
       * Transport (Including Docket records)
       */
      if (
        [
          'Pickup Docket',
          'Delivery Docket',
          'Pickup & Delivery Docket', // Added matching for exact operation name
          'Pickup',
          'Delivery',
        ].includes(
          op.operation_name
        )
      ) {
        service.transports.push(op)
      }
    }

    const jobContainers =
      jobCard.container || []

    for (const containerName of Object.keys(
      containerServices
    )) {
      const service =
        containerServices[
          containerName
        ]

      const container =
        containerDetails.find(
          (c) =>
            c.container_number ===
              containerName ||
            c.name === containerName
        )

      if (!container) continue

      const jcRow =
        jobContainers.find(
          (row) =>
            row.container ===
            containerName
        )

     /*
 * TRANSPORT ITEMS
 */
for (const transport of service.transports) {
  let docketContainer = null

  try {
    const docketDetails =
      await getOperationRecordDetails(
        transport.operation_name,
        transport.operation
      )

    console.log(
      'DOCKET DETAILS',
      docketDetails
    )

    /*
     * Pickup and Delivery Docket stores
     * trip_type, cartage_type and zone
     * inside the container child table.
     */
    docketContainer =
      docketDetails.container?.find(
        (row) =>
          row.container ===
          containerName
      )

    console.log(
      'DOCKET CONTAINER',
      docketContainer
    )
  } catch (error) {
    console.error(
      'Failed to load docket:',
      transport.operation,
      error
    )
  }

  if (!docketContainer) {
    console.warn(
      'No matching container found in docket:',
      transport.operation,
      containerName
    )

    continue
  }

  const transportRate =
    await getServiceRate({
      serviceType: 'TRANSPORT',
      container,
      containerRow:
        docketContainer,
    })

  items.push({
    item_code:
      transportRate.item_code,

    item_name:
      transport.operation_name,

    description:
      `${transport.operation_name} - ${containerName}`,

    qty: 1,

    uom: 'Nos',

    rate:
      transportRate.rate,

    amount:
      transportRate.rate,
  })
}

      /*
       * STORAGE ITEMS
       */

      const gateIns =
        service.gate_ins.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )

      const gateOuts =
        service.gate_outs.sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        )

      for (
        let i = 0;
        i < gateIns.length;
        i++
      ) {
        const gateIn =
          new Date(
            gateIns[i].date
          )

        const gateOut =
          gateOuts[i]
            ? new Date(
                gateOuts[i].date
              )
            : null

        if (!gateOut)
          continue

        const days =
          Math.ceil(
            (gateOut - gateIn) /
              (1000 *
                60 *
                60 *
                24)
          )

        if (days <= 0)
          continue

        const storageRate =
          await getServiceRate({
            serviceType:
              'STORAGE',
            container,
            containerRow: jcRow,
          })

        items.push({
          item_code:
            storageRate.item_code,

          item_name:
            'Container Storage per day Charge',

          description:
            `${containerName}: ${gateIns[i].date} To ${gateOuts[i].date}`,

          qty: days,

          uom: 'Nos',

          rate:
            storageRate.rate,

          amount:
            days *
            storageRate.rate,
        })
      }

      /*
       * CSL HIRE
       */

      if (
        service.is_csl
      ) {
        for (
          let i = 0;
          i <
          gateOuts.length;
          i++
        ) {
          const gateOut =
            new Date(
              gateOuts[i].date
            )

          const nextGateIn =
            gateIns[i + 1]
              ? new Date(
                  gateIns[
                    i + 1
                  ].date
                )
              : new Date()

          const hireDays =
            Math.ceil(
              (nextGateIn -
                gateOut) /
                (1000 *
                  60 *
                  60 *
                  24)
            )

          if (
            hireDays <= 0
          )
            continue

          const hireRate =
            await getServiceRate({
              serviceType:
                'HIRE',
              container,
              containerRow:
                jcRow,
            })

          items.push({
            item_code:
              hireRate.item_code,

            item_name:
              'Container Hire',

            description:
              `${containerName}: ${gateOuts[i].date} To ${
                gateIns[
                  i + 1
                ]
                  ? gateIns[
                      i + 1
                    ].date
                  : 'Today'
              }`,

            qty: hireDays,

            uom: 'Nos',

            rate:
              hireRate.rate,

            amount:
              hireDays *
              hireRate.rate,
          })
        }
      }
    }

    return items
  }