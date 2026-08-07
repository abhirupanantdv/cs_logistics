//quotationRules.js
export const quotationRules = {
  requiredBeforeGetItems: [
    'custom_service_type',
    'custom_cartage_type',
  ],

  validateBeforeGetItems: (
    formData
  ) => {
    const serviceType =
      formData.custom_service_type

    if (
      serviceType === 'Transport' ||
      serviceType ===
        'Storage and Transport'
    ) {
      if (
        !formData.custom_from_location ||
        !formData.custom_to_location
      ) {
        return {
          valid: false,
          message:
            'From Location and To Location are mandatory for Transport Service',
        }
      }
    }

    return {
      valid: true,
    }
  },
}