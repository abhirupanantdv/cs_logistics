//operationTypeService.js
import api from '@/config/api'

/**
 * Fetch Operation Types
 */
export const getAllOperationTypes =
  async () => {
    try {
      const response = await api.get(
        '/resource/Operation Type',
        {
          params: {
            fields: JSON.stringify([
              'name',
              'creation',
              'modified',
            ]),
            limit_page_length: 1000,
            order_by: 'creation asc',
          },
        }
      )

      return response.data.data || []
    } catch (error) {
      console.error(
        'Error fetching Operation Types:',
        error.response?.data || error
      )
      throw error
    }
  }


export const getOperationRecords =
  async (
    doctype,
    limit = 100
  ) => {
    try {
      let actualDoctype = doctype

      // Pickup & Delivery use same ERP Doctype
      if (
        doctype === 'Pickup Docket' ||
        doctype === 'Delivery Docket'
      ) {
        actualDoctype =
          'Pickup and Delivery Docket'
      }

      const response = await api.get(
        `/resource/${encodeURIComponent(
          actualDoctype
        )}`,
        {
          params: {
            fields: JSON.stringify([
              '*',
            ]),
            limit_page_length: limit,
            order_by:
              'creation desc',
          },
        }
      )

      console.log(
        `${doctype} Records:`,
        response.data.data
      )

      return response.data.data || []
    } catch (error) {
      console.error(
        `Error fetching ${doctype}:`,
        error.response?.data ||
          error
      )
      throw error
    }
  }

/**
 * Fetch Single Record
 */
export const getOperationRecordDetails =
  async (
    doctype,
    documentName
  ) => {
    try {
      let actualDoctype = doctype

      if (
        doctype === 'Pickup Docket' ||
        doctype === 'Delivery Docket'
      ) {
        actualDoctype =
          'Pickup and Delivery Docket'
      }

      const response = await api.get(
        `/resource/${encodeURIComponent(
          actualDoctype
        )}/${encodeURIComponent(
          documentName
        )}`
      )

      console.log(
        `${doctype} Details:`,
        response.data.data
      )

      return response.data.data
    } catch (error) {
      console.error(
        `Error fetching ${doctype} details:`,
        error.response?.data ||
          error
      )
      throw error
    }
  } 