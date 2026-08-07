// src/utils/date.js

/**
 * Formats a raw timestamp string into a clean, human-readable format.
 * Input example: "2026-06-19 13:19:02.844661"
 * Output example: "19 Jun 2026"
 * * @param {string|Date} dateString - The raw date value from the backend
 * @returns {string} The formatted date or '-' if invalid
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  
  // Guard against invalid date strings
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Optional: If you also want to show the time alongside the date anywhere
 * Output example: "19 Jun 2026, 13:19"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}