import { getServiceRate }
from '../../config/getServiceRate'

export const buildQuotationItems =
  async ({
    formData,
    containerDetails,
    containerRow,
  }) => {

    const items = []

    const serviceType =
      formData.custom_service_type

    for (const container of containerDetails) {

  const containerNo =
    container.container_number ||
    container.name

  const containerRow =
    formData.custom_container?.find(
      row =>
        row.container === containerNo
    )

  if (!containerRow) {
    console.warn(
      'Container row not found',
      containerNo
    )
    continue
  }
      // TRANSPORT

      if (
        serviceType === 'Transport' ||
        serviceType ===
          'Storage and Transport'
      ) {

        const transport =
          await getServiceRate({
  serviceType: 'TRANSPORT',
  container,
  containerRow,
})

        items.push({
           item_name:
            `Transport for ${containerNo} from ${formData.custom_from_location} to ${formData.custom_to_location}`,

          description:
            `Transport Container For ${containerNo}`,

          qty: 1,

          uom: 'Unit',

          stock_uom: 'Unit',

          rate: transport.rate,

          custom_container:
            containerNo,

          custom_item_master:
            transport.item_code,
        })
      }

      // STORAGE

      if (
        serviceType === 'Storage' ||
        serviceType ===
          'Storage and Transport'
      ) {

        const storage =
         await getServiceRate({
  serviceType: 'STORAGE',
  container,
  containerRow,
})

        items.push({
          item_name:
            `Storage Service for ${containerNo} @ per day rate`,

          description:
            `Storage Container For ${containerNo} @ per day rate`,

          qty: 1,

          uom: 'Unit',

          stock_uom: 'Unit',

          rate: storage.rate,

          custom_container:
            containerNo,

          custom_item_master:
            storage.item_code,
        })
      }

      // HIRE

      if (
        serviceType === 'Hire'
      ) {

        const hire =
          await getServiceRate({
  serviceType: 'HIRE',
  container,
  containerRow,
})

        items.push({
           item_name:
            `Container Hire for ${containerNo} @ per day rate`,

          description:
            `Hire Container For ${containerNo} @ per day rate`,

          qty: 1,

          uom: 'Unit',

          stock_uom: 'Unit',

          rate: hire.rate,

          custom_container:
            containerNo,

          custom_item_master:
            hire.item_code,
        })
      }

      // FALLBACK
      if (
        ![
          'Transport',
          'Storage',
          'Storage and Transport',
          'Hire',
        ].includes(serviceType)
      ) {

        items.push({
          item_name:
            `${serviceType} for ${containerNo}`,

          qty: 1,

          rate: 0,

          custom_container:
            containerNo,
        })
      }
    }

    return items
  }