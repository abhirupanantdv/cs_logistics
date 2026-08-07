export const salesInvoiceRules = {
  validateBeforeGetItems(
    formData,
    jobCard
  ) {
    if (!jobCard?.name) {
      return {
        valid: false,
        message:
          'Job Card not found',
      }
    }

    return {
      valid: true,
    }
  },
}