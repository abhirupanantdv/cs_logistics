// operations/salesInvoice/salesInvoiceServiceRate.js

import api from '@/config/api'

export const getServiceRate = async ({
  serviceType,
  container,
  formData,
}) => {
  let prefix = ''

  if (serviceType === 'TRANSPORT')
    prefix = 'TRP'
  else if (serviceType === 'STORAGE')
    prefix = 'STG'
  else if (serviceType === 'HIRE')
    prefix = 'HIR'

  const size = String(
    container.size || ''
  )
    .replace(/FT/i, '')
    .trim()
    .toUpperCase()

  const type = String(
    container.item || ''
  )
    .trim()
    .toUpperCase()

  const cartage = String(
    formData.custom_cartage_type || ''
  )
    .trim()
    .toUpperCase()

  let itemCode = ''

  if (prefix === 'TRP') {
    const trip = String(
      formData.custom_trip_type || ''
    )
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase())
      .join('')

    const zone = String(
      formData.custom_zone || ''
    )
      .toUpperCase()
      .replace(/^ZONE\s*/i, 'Z')

    itemCode =
      `${prefix}-${cartage}-${size}${type}-${trip}-${zone}`
  } else {
    itemCode =
      `${prefix}-${cartage}-${size}${type}`
  }

  try {
    const res = await api.get(
      `/resource/Item/${itemCode}`
    )

    return {
      item_code: itemCode,
      rate:
        res.data.data?.valuation_rate || 0,
    }
  } catch {
    return {
      item_code: itemCode,
      rate: 0,
    }
  }
}