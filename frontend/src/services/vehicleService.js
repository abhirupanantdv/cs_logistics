import api from '@/config/api'

export const getAllVehicles =
  async () => {
    try {
      const response =
        await api.get(
          '/resource/Vehicle',
          {
            params: {
              fields: JSON.stringify([
                '*',
              ]),
              limit_page_length: 1000,
              order_by:
                'creation desc',
            },
          }
        )

      console.log(
        'Vehicles Response:',
        response.data.data
      )

      return (
        response.data.data || []
      )
    } catch (error) {
      console.error(
        'Error fetching vehicles:',
        error
      )

      throw error
    }
  }

  export const getVehicleMeta =
  async () => {
    try {
      const response =
        await api.get(
          '/method/frappe.desk.form.load.getdoctype',
          {
            params: {
              doctype: 'Vehicle',
            },
          }
        )

      return (
        response.data.docs?.[0] ||
        response.data.docs ||
        response.data
      )
    } catch (error) {
      console.error(error)
      throw error
    }
  }

export const createVehicle =
  async (payload) => {
    try {
      const response =
        await api.post(
          '/resource/Vehicle',
          payload
        )

      return response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }