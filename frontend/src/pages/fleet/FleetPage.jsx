import { useEffect, useState } from 'react'
import {
  Search,
  Truck,
  Plus,
  ChevronRight,
} from 'lucide-react'
import CreateFleetModal from '../../components/fleet/CreateFleetModal'
import Button from '../../components/common/Button'
import Pagination from '@/components/common/Pagination'
import usePagination from '@/hooks/usePagination'
import VehicleDetailsModal from '../../components/fleet/VehicleDetailsModal'
import AppLayout from '@/components/layout/AppLayout'
import StatusBadge from '@/components/layout/StatusBadge'

import {
  getAllVehicles,
} from '@/services/vehicleService'

export default function FleetPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] =
  useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getAllVehicles()
        console.log('Vehicles:', data)
        setVehicles(data || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = searchTerm.toLowerCase()
    return (
      vehicle.name?.toLowerCase().includes(search) ||
      vehicle.model?.toLowerCase().includes(search) ||
      vehicle.fuel_type?.toLowerCase().includes(search) ||
      vehicle.make?.toLowerCase().includes(search) ||
      vehicle.company?.toLowerCase().includes(search)
    )
  })
  useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])
const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedVehicles,
  pageSize,
} = usePagination(filteredVehicles)

  return (
    <AppLayout
      title="Fleet"
      description="Manage vehicles and fleet operations."
    >
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Search Row */}
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
              placeholder="Search vehicles..."
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
            New Fleet
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
              <div className="col-span-3 text-left px-2">Vehicle ID</div>
              <div className="col-span-2 text-left">Model</div>
              <div className="col-span-2 text-left">Mileage</div>
              <div className="col-span-2 text-left">Fuel Type</div>
              <div className="col-span-1 text-left">Make</div>
              <div className="col-span-2 text-left">Company</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Loading vehicles...
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No vehicles found.
                </div>
              ) : (
                paginatedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.name}
                    onClick={() =>
                      setSelectedVehicle(vehicle)
                    }
                    className="
                      grid
                      grid-cols-12
                      items-center
                      px-5
                      py-3
                      hover:bg-slate-50/50
                      transition-all
                      cursor-pointer
                    "
                  >
                    {/* Vehicle ID */}
                    <div className="col-span-3 flex items-center gap-3 px-2 min-w-0">
                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-cyan-50
                          text-cyan-600
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Truck size={16} />
                      </div>

                      <div className="font-semibold text-[#0B2257] text-[13px] truncate">
                        {vehicle.name}
                      </div>
                    </div>

                    {/* Model */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate pr-2">
                      {vehicle.model || '-'}
                    </div>

                    {/* Mileage */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate pr-2">
                      {vehicle.last_odometer != null
                        ? `${vehicle.last_odometer.toLocaleString()} km`
                        : '-'}
                    </div>

                    {/* Fuel Type */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate pr-2">
                      {vehicle.fuel_type || '-'}
                    </div>

                    {/* Make */}
                    <div className="col-span-1 text-left text-[13px] text-slate-600 truncate pr-2">
                      {vehicle.make || '-'}
                    </div>

                    {/* Company */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600 truncate">
                      {vehicle.company || '-'}
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
                Loading vehicles...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No vehicles found.
              </div>
            ) : (
              paginatedVehicles.map((vehicle) => (
                <div
                  key={vehicle.name}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="
                    p-4
                    hover:bg-slate-50/80
                    active:bg-slate-100
                    cursor-pointer
                    transition-all
                    space-y-3
                  "
                >
                  {/* Header row: Icon + Vehicle ID + Chevron */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="
                          w-8
                          h-8
                          rounded-lg
                          bg-cyan-50
                          text-cyan-600
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Truck size={16} />
                      </div>
                      <span className="font-semibold text-[#0B2257] text-sm truncate">
                        {vehicle.name}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                  </div>

                  {/* Details grid: Model & Mileage, Fuel & Make, Company */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Model / Make
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {vehicle.model || '-'}
                        {vehicle.make ? ` • ${vehicle.make}` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Mileage
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {vehicle.last_odometer != null
                          ? `${vehicle.last_odometer.toLocaleString()} km`
                          : '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Fuel Type
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {vehicle.fuel_type || '-'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                        Company
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {vehicle.company || '-'}
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
            {filteredVehicles.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            {' '}to{' '}
            {Math.min(
              currentPage * pageSize,
              filteredVehicles.length
            )}
            {' '}of {filteredVehicles.length} vehicles
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
        <CreateFleetModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(vehicle) => {
            setShowCreateModal(false)
            setVehicles((prev) => [
              vehicle,
              ...prev,
            ])
          }}
        />
      )}
      {selectedVehicle && (
  <VehicleDetailsModal
    vehicle={selectedVehicle}
    onClose={() =>
      setSelectedVehicle(null)
    }
  />
)}
    </AppLayout>
  )
}
