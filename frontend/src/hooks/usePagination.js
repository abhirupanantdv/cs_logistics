// hooks/usePagination.js

import { useState } from 'react'

export default function usePagination(
  data,
  pageSize = 10
) {
  const [currentPage, setCurrentPage] =
    useState(1)

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / pageSize)
  )

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    pageSize,
  }
}