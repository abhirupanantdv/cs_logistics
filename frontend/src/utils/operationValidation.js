export function validateOperation({
  operation,
  formData,
  selectedContainers,
  containerDetails,
  showStorageStart,
  operationStatusMap,
  validateContainerStatusChange,
}) {
  const getTargetStatus =
    () => {
      if (
        operation ===
        'Pickup & Delivery Docket'
      ) {
        return formData.docket_type ===
          'Pickup'
          ? 'Picked Up'
          : 'Delivered'
      }

      return (
        operationStatusMap[
          operation
        ] || null
      )
    }

  // Container status validation
  for (const container of containerDetails) {
    const validation =
      validateContainerStatusChange(
        container.status,
        getTargetStatus(),
        container.container_number
      )

    if (!validation.valid) {
      return validation
    }
  }

  // EIR validation
  if (
    operation ===
    'Equipment Interchange Receipt'
  ) {
    if (
      selectedContainers.length === 0
    ) {
      return {
        valid: false,
        message:
          'Please select at least one container.',
      }
    }

    if (
      !formData.damage_annotation_image
    ) {
      return {
        valid: false,
        message:
          'Please confirm the damage image before submitting.',
      }
    }
  }

  // Gate In validation
  if (
    operation === 'Gate In' &&
    showStorageStart &&
    !formData.storage_start
  ) {
    return {
      valid: false,
      message:
        'Storage Start is mandatory for CSL containers.',
    }
  }

  // Gate In / Gate Out validation
  if (
    (operation === 'Gate In' ||
      operation === 'Gate Out') &&
    selectedContainers.length === 0
  ) {
    return {
      valid: false,
      message:
        'Please select at least one container before creating this operation.',
    }
  }

  return {
    valid: true,
  }
}