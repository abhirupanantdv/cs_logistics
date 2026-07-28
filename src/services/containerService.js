// src/services/containerService.js

import api from '@/config/api'


export const getAllContainers = async () => {
  try {
    const response = await api.get(
      '/resource/Container',
      {
        params: {
          fields: JSON.stringify([
            'name',
            'container_number',
            'item',
            'owner_name',
            'size',
            'status',
            'creation',
          ]),
          limit_page_length: 1000,
          order_by: 'creation desc',
        },
      }
    )

    console.log(
      'Containers:',
      response.data.data
    )

    return response.data.data || []
  } catch (error) {
    console.error(error)
    throw error
  }
}

/**
 * Fetch Container document details by container name.
 *
 * Example:
 * /api/resource/Container/CNT-0001
 */
export const getContainerDetails = async (
  containerName
) => {
  try {
    const response = await api.get(
      `/resource/Container/${encodeURIComponent(
        containerName
      )}`
    )

    console.log(
      `Container Details Response for ${containerName}:`,
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      `Error fetching Container Details for ${containerName}:`,
      error.response?.data || error
    )
    throw error
  }
}
export const createContainer = async (data) => {
  try {
    const response = await api.post(
      '/resource/Container',
      data
    )

    console.log(
      'Container Created:',
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      'Error creating Container:',
      error.response?.data || error
    )
    throw error
  }
}
export const getContainerMeta = async () => {
  try {
    const response = await api.get(
      '/method/frappe.desk.form.load.getdoctype',
      {
        params: {
          doctype: 'Container',
        },
      }
    )

    const meta =
      response.data?.docs?.[0] ||
      response.data?.message?.docs?.[0]

    console.log(
      'Container Meta:',
      meta
    )

    return meta
  } catch (error) {
    console.error(
      'Error fetching Container metadata:',
      error.response?.data || error
    )
    throw error
  }
}