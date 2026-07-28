import api from '@/config/api'

export const getAddress = async (
  addressName
) => {
  const response = await api.get(
    `/resource/Address/${addressName}`
  )

  return response.data.data
}