import { useEffect, useState } from 'react'
import {
  Search,
  Truck,
  Plus,
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
        <div className="flex justify-between items-center">
          <div className="relative max-w-md w-full">
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
>
  New Fleet
</Button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <div className="col-span-3 flex items-center gap-3 px-2">
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
                      "
                    >
                      <Truck size={16} />
                    </div>

                    <div className="font-semibold text-[#0B2257] text-[13px]">
                      {vehicle.name}
                    </div>
                  </div>

                  {/* Model */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {vehicle.model || '-'}
                  </div>

                  {/* Mileage */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {vehicle.last_odometer != null
                      ? `${vehicle.last_odometer.toLocaleString()} km`
                      : '-'}
                  </div>

                  {/* Fuel Type */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {vehicle.fuel_type || '-'}
                  </div>

                  {/* Make */}
                  <div className="col-span-1 text-left text-[13px] text-slate-600">
                    {vehicle.make || '-'}
                  </div>

                  {/* Company */}
                  <div className="col-span-2 text-left text-[13px] text-slate-600">
                    {vehicle.company || '-'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
  <div className="text-xs text-slate-500">
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

  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
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
