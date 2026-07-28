// src/services/customerService.js

import api from '@/config/api'

export const getCustomers = async () => {
  try {
    const response = await api.get(
      '/resource/Customer',
      {
        params: {
          fields: JSON.stringify(['*']),
          limit_page_length: 1000,
          order_by: 'customer_name asc',
        },
      }
    )

    return response.data.data || []
  } catch (error) {
    console.error(
      'Error fetching customer list:',
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Fetch full customer details by customer name
 *
 * Example:
 * /api/resource/Customer/ABC%20Ltd.
 */
export const getCustomerDetails = async (
  customerName
) => {
  try {
    const response = await api.get(
      `/resource/Customer/${encodeURIComponent(
        customerName
      )}`
    )

    console.log(
      `Customer Details Response for ${customerName}:`,
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      `Error fetching Customer Details for ${customerName}:`,
      error.response?.data || error
    )
    throw error
  }
}
