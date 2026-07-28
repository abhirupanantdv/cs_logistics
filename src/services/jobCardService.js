// src/services/jobCardService.js

import api from '@/config/api'

/**
 * Fetch list of Container Job Cards
 */
export const getJobCards = async () => {
  try {
    const response = await api.get(
      '/resource/Container Job Card',
      {
        params: {
          fields: JSON.stringify(['name']),
          limit_page_length: 20,
          order_by: 'creation desc',
        },
      }
    )

    console.log(
      'Container Job Card List Response:',
      response.data.data
    )

    return response.data.data || []
  } catch (error) {
    console.error(
      'Error fetching Container Job Card list:',
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Fetch Job Card Details
 */
export const getJobCardDetails = async (
  jobCardName
) => {
  try {
    const response = await api.get(
      `/resource/Container Job Card/${encodeURIComponent(
        jobCardName
      )}`
    )

    console.log(
      `Job Card Details Response for ${jobCardName}:`,
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      `Error fetching Job Card Details for ${jobCardName}:`,
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Fetch Recent Job Cards for Dashboard
 */
export const getRecentJobCards = async () => {
  try {
    const response = await api.get(
      '/resource/Container Job Card',
      {
        params: {
          fields: JSON.stringify([
            'name',
            'customer',
            'creation',
          ]),
          limit_page_length: 5,
          order_by: 'creation desc',
        },
      }
    )

    const jobCards = response.data.data || []

    const detailedCards = await Promise.all(
      jobCards.map(async (job) => {
        const details =
          await getJobCardDetails(job.name)

        const operations =
          details.operations || []

        const lastOperation =
          operations.length > 0
            ? operations[operations.length - 1]
                .operation_name
            : '-'

        return {
          name: details.name,
          customer: details.customer,
          creation: details.creation,
          lastOperation,
        }
      })
    )

    console.log(
      'Recent Job Cards:',
      detailedCards
    )

    return detailedCards
  } catch (error) {
    console.error(
      'Error fetching Recent Job Cards:',
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Fetch Container Job Card DocType metadata
 */
export const getJobCardMeta = async () => {
  try {
    const response = await api.get(
      '/method/frappe.desk.form.load.getdoctype',
      {
        params: {
          doctype: 'Container Job Card',
        },
      }
    )

    const meta =
      response.data?.docs?.[0] ||
      response.data?.message?.docs?.[0]

    console.log('Container Job Card Meta:', meta)

    return meta
  } catch (error) {
    console.error(
      'Error fetching Container Job Card metadata:',
      error.response?.data || error
    )
    throw error
  }
}

/**
 * Create a new Container Job Card
 */
export const createJobCard = async (data) => {
  try {
    const response = await api.post(
      '/resource/Container Job Card',
      data
    )

    console.log(
      'Job Card Created:',
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      'Error creating Job Card:',
      error.response?.data || error
    )
    throw error
  }
}


export const createOperationDocument = async (
  doctype,
  data
) => {
  try {

    console.log(
      `Creating ${doctype}:`,
      JSON.stringify(data, null, 2)
    )

    const response = await api.post(
      `/resource/${encodeURIComponent(
        doctype
      )}`,
      data
    )

    console.log(
      `Created ${doctype}:`,
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      `Error creating ${doctype} document:`,
      error.response?.data || error
    )
    throw error
  }
}

export const submitOperationDocument = async (
  doc
) => {
  try {
    const response = await api.post(
      '/method/frappe.client.submit',
      {
        doc,
      }
    )

    console.log(
      `Submitted ${doc.doctype}:`,
      response.data.message || response.data
    )

    return response.data.message || response.data
  } catch (error) {
    console.error(
      `Error submitting ${doc.doctype} document:`,
      error.response?.data || error
    )
    throw error
  }
}

export const createAndSubmitOperationDocument = async (
  doctype,
  data
) => {
  const document = await createOperationDocument(
    doctype,
    data
  )

  const submittableDoctypes = [
    'Quotation',
    'Sales Invoice',
    
  ]

  if (submittableDoctypes.includes(doctype)) {
    return await submitOperationDocument(document)
  }

  return document
}

/**
 * Upload a file as an attachment
 */
export const uploadAttachment = async (
  file,
  doctype,
  docname
) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('doctype', doctype)
    formData.append('docname', docname)
    formData.append('is_private', 0)

    const response = await api.post(
      '/api/method/upload_file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    console.log('File uploaded:', response.data)
    return response.data.message
  } catch (error) {
    console.error('Error uploading file:', error.response?.data || error)
    throw error
  }
}
