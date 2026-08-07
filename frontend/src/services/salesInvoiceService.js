import api from '@/config/api'

/**
 * Fetch Sales Invoice List
 */
export const getSalesInvoices = async () => {
  try {
    const response = await api.get(
      '/resource/Sales Invoice',
      {
        params: {
          fields: JSON.stringify([
            'name',
            'customer',
            'posting_date',
            'grand_total',
            'status',
            'docstatus',
          ]),
          limit_page_length: 100,
          order_by: 'creation desc',
        },
      }
    )

    console.log(
      'Sales Invoice List Response:',
      response.data.data
    )

    return response.data.data || []
  } catch (error) {
    console.error(
      'Error fetching Sales Invoices:',
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Fetch Sales Invoice Details
 */
export const getSalesInvoiceDetails =
  async (invoiceName) => {
    try {
      const response = await api.get(
        `/resource/Sales Invoice/${encodeURIComponent(
          invoiceName
        )}`
      )

      console.log(
        `Sales Invoice Details Response for ${invoiceName}:`,
        response.data.data
      )

      return response.data.data
    } catch (error) {
      console.error(
        `Error fetching Sales Invoice ${invoiceName}:`,
        error.response?.data || error
      )
      throw error
    }
  }