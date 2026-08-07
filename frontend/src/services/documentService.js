import api from '@/config/api'

export const getDocument = async (
  doctype,
  name
) => {
  const response =
    await api.get(
      '/method/frappe.client.get',
      {
        params: {
          doctype,
          name,
        },
      }
    )

  return response.data.message
}