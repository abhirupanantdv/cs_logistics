import { getDocument } from '@/services/documentService'

export const handleFetchFrom =
  async ({
    fieldname,
    value,
    meta,
  }) => {
    const changedField =
      meta?.fields?.find(
        field =>
          field.fieldname ===
          fieldname
      )

    if (
      !changedField ||
      changedField.fieldtype !==
        'Link'
    ) {
      return {}
    }

    const dependentFields =
      meta.fields.filter(
        field =>
          field.fetch_from?.startsWith(
            `${fieldname}.`
          )
      )

    if (
      dependentFields.length === 0
    ) {
      return {}
    }

    try {
      const linkedDoc =
        await getDocument(
          changedField.options,
          value
        )

      const updates = {}

      dependentFields.forEach(
        field => {
          const sourceField =
            field.fetch_from.split(
              '.'
            )[1]

          updates[
            field.fieldname
          ] =
            linkedDoc[
              sourceField
            ] || ''
        }
      )

      return updates
    } catch (error) {
      console.error(
        'Fetch From Error',
        error
      )

      return {}
    }
  }