import api from '@/config/api'

export const getAllDrivers = async () => {
  try {
    const response = await api.get(
      '/resource/Driver',
      {
        params: {
          fields: JSON.stringify(['*']),
          limit_page_length: 1000,
        },
      }
    )

    const drivers =
      response.data.data || []

    const sortedDrivers =
      drivers.sort(
        (a, b) =>
          new Date(b.creation) -
          new Date(a.creation)
      )

    console.log(
      'Sorted Drivers:',
      sortedDrivers
    )

    return sortedDrivers
  } catch (error) {
    console.error(
      'Error fetching drivers:',
      error
    )
    throw error
  }
}
export const getDriverMeta = async () => {
  try {
    const response = await api.get(
      '/method/frappe.desk.form.load.getdoctype',
      {
        params: {
          doctype: 'Driver',
        },
      }
    )

    console.log(
      'Driver Meta:',
      response.data.docs?.[0]
    )

    return response.data.docs?.[0]
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const createDriver = async (
  payload
) => {
  try {
    const response = await api.post(
      '/resource/Driver',
      payload
    )

    console.log(
      'Driver Created:',
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
export const getDriverDetails = async (
  driverName
) => {
  try {
    const response = await api.get(
      `/resource/Driver/${encodeURIComponent(
        driverName
      )}`
    )

    console.log(
      `Driver Details Response for ${driverName}:`,
      response.data.data
    )

    return response.data.data
  } catch (error) {
    console.error(
      `Error fetching Driver Details for ${driverName}:`,
      error.response?.data || error
    )
    throw error
  }
}