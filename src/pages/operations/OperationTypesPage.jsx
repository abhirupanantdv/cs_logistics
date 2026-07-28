//OperationTypes.jsx
import { useEffect, useState } from 'react'
import {
  Search,
  Filter,
  Download,
} from 'lucide-react'

import AppLayout from '@/components/layout/AppLayout'
import OperationTabs from './OperationTabs'
import Pagination from '@/components/common/Pagination'
import usePagination from '@/hooks/usePagination'

import {
  getAllOperationTypes,
  getOperationRecords,
  getOperationRecordDetails,
} from '@/services/operationTypeService'

import { operationColumns } from '../../config/operationColumns'
import OperationDetailsModal from '../../components/operations/OperationRecordDetailsModal'

export default function OperationTypesPage() {
  const [recordsLoading, setRecordsLoading] =
    useState(false)

  const [operations, setOperations] =
    useState([])

  const [activeTab, setActiveTab] =
    useState('Gate In')

  const [records, setRecords] =
    useState([])

  const [searchTerm, setSearchTerm] =
    useState('')

  const [selectedRecord, setSelectedRecord] =
    useState(null)

  const [showDetailsModal, setShowDetailsModal] =
    useState(false)

  const columns =
    operationColumns[activeTab] || []

  const [dateFilter, setDateFilter] =
  useState('all')

  const [fromDate, setFromDate] =
    useState('')

  const [toDate, setToDate] =
    useState('')

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const data =
          await getAllOperationTypes()

        setOperations(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchOperations()
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setRecordsLoading(true)

        let data =
          await getOperationRecords(
            activeTab
          )

        if (
          activeTab ===
          'Pickup Docket'
        ) {
          data = data.filter(
            (row) =>
              row.docket_type ===
              'Pickup'
          )
        }

        if (
          activeTab ===
          'Delivery Docket'
        ) {
          data = data.filter(
            (row) =>
              row.docket_type ===
              'Delivery'
          )
        }

        setRecords(data || [])
      } catch (error) {
        console.error(error)
        setRecords([])
      } finally {
        setRecordsLoading(false)
      }
    }

    if (activeTab) {
      fetchRecords()
    }
  }, [activeTab])

  const filteredRecords =
  records.filter((record) => {
    const search =
      searchTerm.toLowerCase()

    const matchesSearch =
      columns.some((column) =>
        String(
          record[column.field] || ''
        )
          .toLowerCase()
          .includes(search)
      )

    if (!matchesSearch)
      return false

    const recordDate =
      new Date(
        record.creation ||
          record.modified
      )

    const today = new Date()

    let matchesDate = true

    switch (dateFilter) {
      case '30':
        matchesDate =
          recordDate >=
          new Date(
            today.setDate(
              today.getDate() - 30
            )
          )
        break

      case '90':
        matchesDate =
          recordDate >=
          new Date(
            today.setDate(
              today.getDate() - 90
            )
          )
        break

      case '180':
        matchesDate =
          recordDate >=
          new Date(
            today.setDate(
              today.getDate() - 180
            )
          )
        break

      case '365':
        matchesDate =
          recordDate >=
          new Date(
            today.setDate(
              today.getDate() - 365
            )
          )
        break

      case 'custom':
        if (
          fromDate &&
          toDate
        ) {
          matchesDate =
            recordDate >=
              new Date(fromDate) &&
            recordDate <=
              new Date(
                `${toDate}T23:59:59`
              )
        }
        break

      default:
        matchesDate = true
    }

    return matchesDate
  })

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData:
      paginatedRecords,
    pageSize,
  } = usePagination(
    filteredRecords
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const getCellValue = (
    record,
    field
  ) => {
    if (
      field === 'creation' &&
      record.creation
    ) {
      return new Date(
        record.creation
      ).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    if (
      field ===
        'datetime_of_interchange' &&
      record.datetime_of_interchange
    ) {
      return new Date(
        record.datetime_of_interchange
      ).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    if (
      field ===
        'grand_total' &&
      record.grand_total != null
    ) {
      return `PGK ${Number(
        record.grand_total
      ).toLocaleString()}`
    }

    return record[field] ?? '-'
  }

  const handleRowClick =
    async (record) => {
      try {
        const details =
          await getOperationRecordDetails(
            activeTab,
            record.name
          )

        setSelectedRecord(details)
        setShowDetailsModal(true)
      } catch (error) {
        console.error(error)
      }
    }

    const exportCSV = () => {
  const headers =
    columns.map(
      (col) => col.label
    )

  const rows =
    filteredRecords.map(
      (record) =>
        columns.map((col) =>
          getCellValue(
            record,
            col.field
          )
        )
    )

  const csvContent =
    [
      headers.join(','),
      ...rows.map((row) =>
        row.join(',')
      ),
    ].join('\n')

  const blob = new Blob(
    [csvContent],
    {
      type: 'text/csv;charset=utf-8;',
    }
  )

  const url =
    window.URL.createObjectURL(
      blob
    )

  const link =
    document.createElement('a')

  link.href = url

  link.download = `${activeTab.replaceAll(
    ' ',
    '_'
  )}_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`

  link.click()

  window.URL.revokeObjectURL(
    url
  )
}

  return (
    <AppLayout
      title="Operations"
      description="Create, view and manage all operations"
    >
      <div className="space-y-4">
        <OperationTabs
          operations={operations}
          activeTab={activeTab}
          onTabChange={
            setActiveTab
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
  {/* Left Side */}
  <div className="flex flex-wrap items-center gap-3">
  {/* Search */}
  <div className="relative w-[320px]">
    <Search
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      type="text"
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
      placeholder="Search records..."
      className="
        w-full
        h-10
        pl-10
        pr-4
        bg-white
        border
        border-slate-200
        rounded-lg
        text-xs
        outline-none
      "
    />
  </div>

  {/* Date Filter */}
  <select
    value={dateFilter}
    onChange={(e) =>
      setDateFilter(e.target.value)
    }
    className="
      h-10
      rounded-lg
      border
      border-slate-200
      px-3
      text-xs
      bg-white
      min-w-[160px]
    "
  >
    <option value="all">
      All Time
    </option>

    <option value="30">
      Last 30 Days
    </option>

    <option value="90">
      Last 90 Days
    </option>

    <option value="180">
      Last 6 Months
    </option>

    <option value="365">
      Last 1 Year
    </option>

    <option value="custom">
      Custom Range
    </option>
  </select>

  {/* Custom Date Range */}
  {dateFilter === 'custom' && (
    <>
      <input
        type="date"
        value={fromDate}
        onChange={(e) =>
          setFromDate(
            e.target.value
          )
        }
        className="
          h-10
          rounded-lg
          border
          border-slate-200
          px-3
          text-xs
          bg-white
        "
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) =>
          setToDate(
            e.target.value
          )
        }
        className="
          h-10
          rounded-lg
          border
          border-slate-200
          px-3
          text-xs
          bg-white
        "
      />
    </>
  )}
</div>
  {/* Export */}
  <button
    onClick={exportCSV}
    className="
      h-10
      px-4
      rounded-lg
      bg-[#006B82]
      text-white
      text-xs
      font-medium
      flex
      items-center
      gap-2
      hover:bg-[#005a6a]
    "
  >
    <Download size={14} />
    Export CSV
  </button>
</div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div
            className="grid px-5 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-400"
            style={{
              gridTemplateColumns:
                columns
                  .map(
                    (col) =>
                      col.width
                  )
                  .join(' '),
            }}
          >
            {columns.map(
              (column) => (
                <div
                  key={
                    column.field
                  }
                  className="px-2"
                >
                  {
                    column.label
                  }
                </div>
              )
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {recordsLoading ? (
              <div className="p-8 text-center">
                Loading...
              </div>
            ) : (
              paginatedRecords.map(
                (record) => (
                  <div
                    key={
                      record.name
                    }
                    onClick={() =>
                      handleRowClick(
                        record
                      )
                    }
                    className="grid px-5 py-3.5 items-center hover:bg-slate-50 cursor-pointer transition-all"
                    style={{
                      gridTemplateColumns:
                        columns
                          .map(
                            (
                              col
                            ) =>
                              col.width
                          )
                          .join(
                            ' '
                          ),
                    }}
                  >
                    {columns.map(
                      (
                        column
                      ) => (
                        <div
                          key={
                            column.field
                          }
                          className="px-2 truncate text-[13px]"
                        >
                          {getCellValue(
                            record,
                            column.field
                          )}
                        </div>
                      )
                    )}
                  </div>
                )
              )
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing{' '}
            {(currentPage -
              1) *
              pageSize +
              1}{' '}
            -{' '}
            {Math.min(
              currentPage *
                pageSize,
              filteredRecords.length
            )}{' '}
            of{' '}
            {
              filteredRecords.length
            }
          </div>

          <Pagination
            currentPage={
              currentPage
            }
            totalPages={
              totalPages
            }
            onPageChange={
              setCurrentPage
            }
          />
        </div>

        {showDetailsModal &&
          selectedRecord && (
            <OperationDetailsModal
              operationType={
                activeTab
              }
              record={
                selectedRecord
              }
              onClose={() => {
                setShowDetailsModal(
                  false
                )
                setSelectedRecord(
                  null
                )
              }}
            />
          )}
      </div>
    </AppLayout>
  )
}