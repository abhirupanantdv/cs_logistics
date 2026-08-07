// ContainersPage.jsx
import { useEffect, useState } from 'react'
import {
  Search,
  Package,
  User,
  Plus,
} from 'lucide-react'
import Pagination from '../../components/common/Pagination'
import usePagination from '@/hooks/usePagination'
import Button from '../../components/common/Button'
import AppLayout from '@/components/layout/AppLayout'
import StatusBadge from '@/components/layout/StatusBadge'
import ContainerDetailsModal from './ContainerDetailsModal'
import CreateContainerModal from '../../components/job-card/CreateContainerModal'

import {
  getAllContainers,
  getContainerDetails,
} from '@/services/containerService'

export default function ContainersPage() {
  const [containers, setContainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] =
  useState(false)
  const [selectedContainer, setSelectedContainer] =
  useState(null)

const [showDetailsModal, setShowDetailsModal] =
  useState(false)
 
useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        const data = await getAllContainers()
        console.log('Container Documents:', data)
        setContainers(data || [])
      } catch (error) {
        console.error('Error fetching containers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContainers()
  }, [])

  const filteredContainers = containers
  .filter((container) => {
    const containerNo =
      container.container_number || ''

    const isCSLContainer =
      containerNo.startsWith('CSL')

    const isAvailable =
      container.status === 'Available'

    // Hide containers that are NOT CSL and are Available
    return !(
      !isCSLContainer &&
      isAvailable
    )
  })
  .filter((container) => {
    const search =
      searchTerm.toLowerCase()

    return (
      container.container_number
        ?.toLowerCase()
        .includes(search) ||
      container.item
        ?.toLowerCase()
        .includes(search) ||
      container.owner_name
        ?.toLowerCase()
        .includes(search) ||
      container.status
        ?.toLowerCase()
        .includes(search) ||
      String(
        container.size || ''
      )
        .toLowerCase()
        .includes(search)
    )
  })

  const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedContainers,
  pageSize,
} = usePagination(filteredContainers)
 

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return {
          badge: 'bg-green-100 text-green-700',
          icon: 'bg-green-50 text-green-600',
        }
      case 'In Transit':
        return {
          badge: 'bg-blue-100 text-blue-700',
          icon: 'bg-blue-50 text-blue-600',
        }
      case 'In Yard':
        return {
          badge: 'bg-orange-100 text-orange-700',
          icon: 'bg-orange-50 text-orange-600',
        }
      case 'Dispatched':
        return {
          badge: 'bg-cyan-100 text-cyan-700',
          icon: 'bg-cyan-50 text-cyan-600',
        }
      case 'Quoted':
        return {
          badge: 'bg-purple-100 text-purple-700',
          icon: 'bg-purple-50 text-purple-600',
        }
      case 'Invoiced':
        return {
          badge: 'bg-emerald-100 text-emerald-700',
          icon: 'bg-emerald-50 text-emerald-600',
        }
      case 'Rent':
        return {
          badge: 'bg-yellow-100 text-yellow-700',
          icon: 'bg-yellow-50 text-yellow-600',
        }
      case 'Delivered':
        return {
          badge: 'bg-teal-100 text-teal-700',
          icon: 'bg-teal-50 text-teal-600',
        }
      case 'Picked Up':
        return {
          badge: 'bg-pink-100 text-pink-700',
          icon: 'bg-pink-50 text-pink-600',
        }
      default:
        return {
          badge: 'bg-slate-100 text-slate-700',
          icon: 'bg-slate-50 text-slate-600',
        }
    }
  }
const handleContainerClick = async (
  container
) => {
  try {
    const details =
      await getContainerDetails(
        container.name
      )

    console.log(
      'Container Details:',
      details
    )

    setSelectedContainer(details)
    setShowDetailsModal(true)
  } catch (error) {
    console.error(error)
  }
}
  return (
    <AppLayout
      title="Containers"
      description="View and manage all your containers in one place."
    >
      <div className="max-w-7xl mx-auto space-y-4">
        
        <div className="flex justify-between items-center">
  {/* Search */}
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
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
      placeholder="Search containers..."
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

  {/* New Container Button */}
  <Button
  icon={<Plus size={16} />}
  onClick={() =>
    setShowCreateModal(true)
  }
>
  New Container
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
            <div className="col-span-3 text-left px-2">Container No.</div>
            <div className="col-span-2 text-left">Size</div>
            <div className="col-span-3 text-left">Type</div>
            <div className="col-span-2 text-left">Owner</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading containers...
              </div>
            ) : filteredContainers.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No containers found.
              </div>
            ) : (
              paginatedContainers.map((container) => {
  const statusStyle =
    getStatusColor(
      container.status
    )
                return (
                  <div
  key={container.name}
  onClick={() =>
    handleContainerClick(
      container
    )
  }
  className="
    grid
    grid-cols-12
    items-center
    px-5
    py-3
    hover:bg-slate-50
    cursor-pointer
    transition-all
  "
>
                    {/* Container */}
                    <div className="col-span-3 flex items-center gap-3 px-2">
                      <div
                        className={`
                          w-8
                          h-8
                          rounded-lg
                          flex
                          items-center
                          justify-center
                          ${statusStyle.icon}
                        `}
                      >
                        <Package size={16} />
                      </div>

                      <div className="font-semibold text-[#0B2257] text-[13px]">
                        {container.container_number}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="col-span-2 text-left text-[13px] text-slate-600">
                      {container.size ? `${container.size} FT` : '-'}
                    </div>

                    {/* Type */}
                    <div className="col-span-3 text-left text-[13px] text-slate-600">
                      {container.item}
                    </div>

                    {/* Owner */}
                    <div className="col-span-2 flex items-center gap-2 text-[13px] text-slate-600">
                      <User size={13} className="text-slate-400" />
                      <span className="truncate">{container.owner_name}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <StatusBadge
                        label={container.status}
                        color={statusStyle.badge}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
  <div className="text-xs text-slate-500">
    Showing{' '}
    {filteredContainers.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1}
    {' '}to{' '}
    {Math.min(
      currentPage * pageSize,
      filteredContainers.length
    )}
    {' '}of {filteredContainers.length} containers
  </div>

  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
</div>
      </div>
      {showCreateModal && (
  <CreateContainerModal
    onClose={() =>
      setShowCreateModal(false)
    }
    onCreated={(container) => {
      setShowCreateModal(false)

      setContainers((prev) => [
        container,
        ...prev,
      ])
    }}
  />
)}
{showDetailsModal &&
  selectedContainer && (
    <ContainerDetailsModal
      container={
        selectedContainer
      }
      onClose={() => {
        setShowDetailsModal(
          false
        )
        setSelectedContainer(
          null
        )
      }}
    />
)}
    </AppLayout>
  )
}
