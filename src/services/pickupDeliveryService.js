// src/services/pickupDeliveryService.js

import api from '@/config/api'

export const getUpcomingPickupDeliveries =
  async () => {
    try {
      const response =
        await api.get(
          '/resource/Pickup and Delivery Docket',
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
        'Pickup & Delivery Dockets:',
        response.data.data
      )

      return (
        response.data.data || []
      )
    } catch (error) {
      console.error(
        'Error fetching Pickup & Delivery Dockets:',
        error
      )

      throw error
    }
  }

export const getPickupDeliveryMeta =
  async () => {
    try {
      const response =
        await api.get(
          '/method/frappe.desk.form.load.getdoctype',
          {
            params: {
              doctype:
                'Pickup and Delivery Docket',
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