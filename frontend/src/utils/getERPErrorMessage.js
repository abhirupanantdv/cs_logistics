// src/utils/getERPErrorMessage.js

export const getERPErrorMessage = (
  error
) => {
  const data =
    error?.response?.data

  if (!data)
    return (
      error.message ||
      'Unknown error'
    )

  if (data._server_messages) {
    try {
      const messages = JSON.parse(
        data._server_messages
      )

      const first = JSON.parse(
        messages[0]
      )

      return first.message
    } catch {
      //
    }
  }

  if (data.exc)
    return data.exc

  if (data.message)
    return data.message

  return 'Operation failed'
}