//DriversPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  UserCheck,
  Plus,
  ChevronRight,
} from 'lucide-react'
import Pagination from '@/components/common/Pagination'
import usePagination from '@/hooks/usePagination'
import Button from '../../components/common/Button'
import StatusBadge from '@/components/layout/StatusBadge'
import CreateDriverModal from '@/components/driver/CreateDriverModal'
import DriverDetailsModal from './DriverDetailsModal'
import AppLayout from '@/components/layout/AppLayout'

import {
  getAllDrivers, getDriverDetails,
} from '@/services/driverService'

export default function DriversPage() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDriver, setSelectedDriver] =
  useState(null)

const [showDetailsModal, setShowDetailsModal] =
  useState(false)

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getAllDrivers()
        console.log('Drivers:', data)
        setDrivers(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const filteredDrivers = drivers.filter((driver) => {
    const search = searchTerm.toLowerCase()
    return (
      driver.name?.toLowerCase().includes(search) ||
      driver.full_name?.toLowerCase().includes(search) ||
      driver.status?.toLowerCase().includes(search)
    )
  })
  useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])
  const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedDrivers,
  pageSize,
} = usePagination(filteredDrivers)

const handleDriverClick = async (
  driver
) => {
  try {
    const details =
      await getDriverDetails(
        driver.name
      )

    setSelectedDriver(details)
    setShowDetailsModal(true)
  } catch (error) {
    console.error(error)
  }
}

  return (
    <AppLayout
      title="Drivers"
      description="Manage all drivers and onboarding records."
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-slate-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drivers..."
              className="
                w-full
                h-10
                pl-10
                pr-4
                rounded-lg
                border
                border-slate-200
                bg-white
                text-xs
                shadow-sm
                outline-none
                focus:ring-2
                focus:ring-[#006B82]
                transition-all
              "
            />
          </div>

          <Button
            icon={<Plus size={16} />}
            onClick={() =>
              setShowCreateModal(true)
            }
            className="w-full sm:w-auto justify-center"
          >
            New Driver
          </Button>
        </div>

        {/* Table Card Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View (md and above) */}
          <div className="hidden md:block">
            {/* Header */}
            <div
              className="
                grid
                grid-cols-12
                px-5
                py-3
                bg-slate-50
                border-b
                border-slate-200
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              <div className="col-span-4 text-left px-2">Driver ID</div>
              <div className="col-span-4 text-left">Driver Name</div>
              <div className="col-span-2 text-center">Employee</div>
              <div className="col-span-2 text-center">Status</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Loading drivers...
                </div>
              ) : filteredDrivers.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No drivers found.
                </div>
              ) : (
                paginatedDrivers.map((driver) => (
                  <div
                    key={driver.name}
                    onClick={() =>
                      handleDriverClick(driver)
                    }
                    className="
                      grid
                      grid-cols-12
                      items-center
                      px-5
                      py-3
                      hover:bg-slate-50
                      transition-all
                      cursor-pointer
                    "
                  >
                    {/* Driver ID */}
                    <div className="col-span-4 flex items-center gap-3 px-2 min-w-0">
                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          overflow-hidden
                          bg-cyan-50
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        {driver.profile_photo ? (
                          <img
                            src={driver.profile_photo}
                            alt={driver.full_name}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <UserCheck
                            size={16}
                            className="text-cyan-600"
                          />
                        )}
                      </div>

                      <div className="font-semibold text-[#0B2257] text-[13px] truncate">
                        {driver.name}
                      </div>
                    </div>

                    {/* Driver Name */}
                    <div className="col-span-4 text-left text-[13px] text-slate-600 truncate pr-2">
                      {driver.full_name || '-'}
                    </div>

                    {/* Employee */}
                    <div className="col-span-2 flex justify-center min-w-0 px-1">
                      {driver.employee ? (
                        <span
                          className="
                            inline-flex
                            rounded-lg
                            bg-slate-100
                            px-2.5
                            py-0.5
                            text-[11px]
                            font-medium
                            text-slate-700
                            truncate
                          "
                        >
                          {driver.employee}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <StatusBadge
                        label={driver.status}
                        color={
                          driver.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile Card View (below md) */}
          <div className="block md:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading drivers...
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No drivers found.
              </div>
            ) : (
              paginatedDrivers.map((driver) => (
                <div
                  key={driver.name}
                  onClick={() => handleDriverClick(driver)}
                  className="
                    p-4
                    hover:bg-slate-50/80
                    active:bg-slate-100
                    cursor-pointer
                    transition-all
                    space-y-3
                  "
                >
                  {/* Header row: Avatar + Driver ID + Status + Chevron */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          overflow-hidden
                          bg-cyan-50
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        {driver.profile_photo ? (
                          <img
                            src={driver.profile_photo}
                            alt={driver.full_name}
                            className="
                              w-full
                              h-full
                              object-cover
                            "
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <UserCheck
                            size={16}
                            className="text-cyan-600"
                          />
                        )}
                      </div>

                      <span className="font-semibold text-[#0B2257] text-sm truncate">
                        {driver.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusBadge
                        label={driver.status}
                        color={
                          driver.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }
                      />
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>

                  {/* Details grid: Driver Name & Employee */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Driver Name
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {driver.full_name || '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Employee ID
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {driver.employee || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-center sm:text-left">
          <div className="text-xs text-slate-500 order-2 sm:order-1">
            Showing{' '}
            {filteredDrivers.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            {' '}to{' '}
            {Math.min(
              currentPage * pageSize,
              filteredDrivers.length
            )}
            {' '}of {filteredDrivers.length} drivers
          </div>

          <div className="order-1 sm:order-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateDriverModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(driver) => {
            console.log('Created Driver:', driver)
            setShowCreateModal(false)
            window.location.reload()
          }}
        />
      )}
      {showDetailsModal &&
  selectedDriver && (
    <DriverDetailsModal
      driver={selectedDriver}
      onClose={() => {
        setShowDetailsModal(false)
        setSelectedDriver(null)
      }}
    />
  )}
    </AppLayout>
  )
}
