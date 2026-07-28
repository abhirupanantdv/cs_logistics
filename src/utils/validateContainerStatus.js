// src/utils/validateContainerStatus.js

import {allowedStatusFlow} from '../config/containerStatusFlow'

export const validateContainerStatusChange = (
  currentStatus,
  newStatus,
  containerNumber
) => {
  const allowed =
    allowedStatusFlow[currentStatus] || []

  if (!allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `
Container ${containerNumber}

Current Status:
${currentStatus}

Cannot change to:
${newStatus}

Allowed:
${allowed.join(', ')}
      `,
    }
  }

  return {
    valid: true,
  }
}