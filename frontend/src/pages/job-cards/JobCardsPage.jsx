
// JobCardsPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import AppLayout from '../../components/layout/AppLayout'
import StatusBadge from '../../components/layout/StatusBadge'
import CreateJobCardModal from '../../components/job-card/CreateJobCardModal'
import Pagination from '@/components/common/Pagination'
import usePagination from '@/hooks/usePagination'

import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  ClipboardList,
  Truck,
  Warehouse,
  FileText,
} from 'lucide-react'

import {
  getJobCards,
  getJobCardDetails,
} from '@/services/jobCardService'

export default function JobCardsPage() {
  const [loading, setLoading] = useState(true)
  const [jobCards, setJobCards] = useState([])
  const [searchTerm, setSearchTerm] =
    useState('')
  const [showCreateModal, setShowCreateModal] =
    useState(false)
  const navigate = useNavigate()
  

  useEffect(() => {
    const fetchJobCards = async () => {
      try {
        const list = await getJobCards()

        console.log(
          'Job Card List:',
          list
        )

        const details =
          await Promise.all(
            list.map((item) =>
              getJobCardDetails(
                item.name
              )
            )
          )

        console.log(
          'All Job Card Details:',
          details
        )

        const formatted =
          details.map((jobCard) => {
            const latestOperation =
              jobCard.operations?.[
                jobCard.operations
                  .length - 1
              ]

            const invoiceStatus =
              jobCard.container?.some(
                (container) =>
                  container.status ===
                  'Invoiced'
              )
                ? 'Paid'
                : 'Unpaid'

            return {
              id: jobCard.name,

              customer:
                jobCard.customer,

              serviceType:
                jobCard.service_type,

              status:
                latestOperation
                  ?.operation_name ||
                'Pending',

              operationDate:
                latestOperation?.time,

              containers:
                jobCard.container ||
                [],

              invoiceStatus,
            }
          })

        setJobCards(formatted)
      } catch (error) {
        console.error(
          'Error fetching job cards:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchJobCards()
  }, [])

  const filteredCards =
    jobCards.filter((card) => {
      const search =
        searchTerm.toLowerCase()

      return (
        card.id
          ?.toLowerCase()
          .includes(search) ||
        card.customer
          ?.toLowerCase()
          .includes(search) ||
        card.status
          ?.toLowerCase()
          .includes(search)
      )
    })

  const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: paginatedCards,
  pageSize,
} = usePagination(filteredCards)

useEffect(() => {
  setCurrentPage(1)
}, [searchTerm])

  const getStatusConfig = (
  status
) => {
  switch (status) {
    case 'Gate Out':
      return {
        badge:
          'bg-green-100 text-green-700',
        accent:
          'bg-green-500',
        icon: Truck,
      }

    case 'Gate In':
      return {
        badge:
          'bg-blue-100 text-blue-700',
        accent:
          'bg-blue-500',
        icon: Warehouse,
      }

    case 'Quotation':
      return {
        badge:
          'bg-orange-100 text-orange-700',
        accent:
          'bg-orange-500',
        icon: ClipboardList,
      }

    case 'Sales Invoice':
      return {
        badge:
          'bg-purple-100 text-purple-700',
        accent:
          'bg-purple-500',
        icon: FileText,
      }

    case 'Equipment Interchange Receipt':
      return {
        badge:
          'bg-teal-100 text-teal-700',
        accent:
          'bg-teal-500',
        icon: ClipboardList,
      }

    case 'Pickup Docket':
      return {
        badge:
          'bg-pink-100 text-pink-700',
        accent:
          'bg-pink-500',
        icon: Truck,
      }

    case 'Delivery Docket':
      return {
        badge:
          'bg-emerald-100 text-emerald-700',
        accent:
          'bg-emerald-500',
        icon: Truck,
      }

    default:
      return {
        badge:
          'bg-slate-100 text-slate-700',
        accent:
          'bg-slate-400',
        icon: ClipboardList,
      }
  }
}

  const formatDate = (
    dateString
  ) => {
    if (!dateString) return '-'

    return new Date(
      dateString
    ).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  return (
    <AppLayout
      title="Job Cards"
      description="Manage and track all your job cards in one place."
    >
      <div className="max-w-[1300px] mx-auto space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="flex gap-3">
            <div
              className="
                w-full
                sm:w-[280px]
                h-10
                bg-white
                rounded-lg
                border
                border-slate-200
                flex
                items-center
                px-3
                gap-2.5
              "
            >
              <Search
                size={16}
                className="text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Job Card No., Customer..."
                className="
                  flex-1
                  outline-none
                  text-xs
                "
              />
            </div>
          </div>

          <Button
            icon={<Plus size={16} />}
            onClick={() =>
              setShowCreateModal(true)
            }
            className="w-full sm:w-auto justify-center"
          >
            New Job Card
          </Button>
        </div>

        {/* Table Card Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Desktop Table View (lg and above) */}
          <div className="hidden lg:block">
            {/* Header */}
            <div
              className="
                grid
                grid-cols-[4px_1.8fr_1.2fr_2.8fr_1.2fr_40px]
                bg-slate-50
                border-b
                border-slate-200
                py-3
                px-4
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
              "
            >
              <div />
              <div className="text-left px-2">Job Card</div>
              <div className="text-left">Customer</div>
              <div className="text-left">Containers</div>
              <div className="text-center">Last Operation</div>
              <div />
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Loading job cards...
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No job cards found.
                </div>
              ) : (
                paginatedCards.map((item) => {
                  const config = getStatusConfig(item.status)
                  const Icon = config.icon

                  return (
                    <div
                      key={item.id}
                      className="
                        grid
                        grid-cols-[4px_1.8fr_1.2fr_2.8fr_1.2fr_40px]
                        items-center
                        hover:bg-slate-50/50
                        transition
                        cursor-pointer
                      "
                      onClick={() =>
                        navigate(`/job-cards/${encodeURIComponent(item.id)}`)
                      }
                    >
                      {/* Accent border */}
                      <div className={`${config.accent} self-stretch w-1`} />

                      {/* Job Card & Type */}
                      <div className="flex items-center gap-3 px-2 py-2.5">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-slate-50
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Icon
                            size={16}
                            className="text-[#006B82]"
                          />
                        </div>

                        <div className="min-w-0">
                          <h2
                            className="
                              text-[13px]
                              font-bold
                              text-[#006B82]
                              truncate
                            "
                          >
                            {item.id}
                          </h2>
                        </div>
                      </div>

                      {/* Customer */}
                      <div className="text-left text-[13px] text-slate-600 truncate pr-3">
                        {item.customer}
                      </div>

                      {/* Containers Nested View */}
                      <div className="px-3 py-2 min-w-0">
                        <div
                          className="
                            grid
                            grid-cols-[2fr_1.5fr_60px_100px_60px]
                            gap-2
                            text-[9px]
                            uppercase
                            tracking-wider
                            text-slate-400
                            mb-1
                            text-left
                          "
                        >
                          <div>Container No.</div>
                          <div>Owner</div>
                          <div className="text-center">Size</div>
                          <div className="text-center">Status</div>
                          <div>Type</div>
                        </div>

                        <div className="space-y-0.5">
                          {item.containers?.slice(0, 2).map((container) => (
                            <div
                              key={container.name}
                              className="
                                grid
                                grid-cols-[2fr_1.5fr_60px_100px_60px]
                                gap-2
                                text-[11px]
                                items-center
                                text-left
                                text-slate-600
                              "
                            >
                              <div className="truncate">
                                {container.container}
                              </div>

                              <div className="truncate">
                                {container.container_owner ||
                                  container.owner_name ||
                                  'N/A'}
                              </div>
                              <div className="text-center font-medium text-slate-700">
                                {container.size || '-'}
                              </div>
                              <div className="flex justify-center">
                                <span
                                  className={`
                                    inline-flex
                                    rounded-full
                                    px-1.5
                                    py-0.2
                                    text-[9px]
                                    font-semibold
                                    ${
                                      container.status === 'Available'
                                        ? 'bg-green-100 text-green-700'
                                        : container.status === 'Quoted'
                                        ? 'bg-blue-100 text-blue-700'
                                        : container.status === 'Picked Up'
                                        ? 'bg-amber-100 text-amber-700'
                                        : container.status === 'In Transit'
                                        ? 'bg-purple-100 text-purple-700'
                                        : container.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : container.status === 'Rent'
                                        ? 'bg-cyan-100 text-cyan-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }
                                  `}
                                >
                                  {container.status || 'N/A'}
                                </span>
                              </div>

                              <div className="truncate">
                                {container.type}
                              </div>
                            </div>
                          ))}
                        </div>

                        {item.containers?.length > 2 && (
                          <div className="mt-1 text-[10px] font-semibold text-[#006B82]">
                            +{item.containers.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Last Operation */}
                      <div className="flex flex-col justify-center text-center px-2">
                        <div className="flex justify-center">
                          <span
                            className={`
                              inline-flex
                              items-center
                              rounded-full
                              px-2.5
                              py-1
                              text-[10px]
                              font-semibold
                              ${config.badge}
                            `}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Arrow */}
                      <div className="flex items-center justify-center">
                        <ChevronRight
                          size={16}
                          className="text-slate-400 group-hover:text-slate-600"
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Mobile Card View (below lg) */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Loading job cards...
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No job cards found.
              </div>
            ) : (
              paginatedCards.map((item) => {
                const config = getStatusConfig(item.status)
                const Icon = config.icon
                const borderColorClass = config.accent.replace('bg-', 'border-')

                return (
                  <div
                    key={item.id}
                    className={`
                      p-4
                      border-l-4
                      ${borderColorClass}
                      hover:bg-slate-50/80
                      active:bg-slate-100
                      transition-all
                      cursor-pointer
                      space-y-3
                    `}
                    onClick={() =>
                      navigate(`/job-cards/${encodeURIComponent(item.id)}`)
                    }
                  >
                    {/* Top row: Job Card ID, Customer, Status badge, Arrow */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="
                            w-8
                            h-8
                            rounded-lg
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Icon size={16} className="text-[#006B82]" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-sm font-bold text-[#006B82] truncate">
                            {item.id}
                          </h2>
                          <div className="text-xs text-slate-500 truncate">
                            {item.customer}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            px-2.5
                            py-0.5
                            text-[10px]
                            font-semibold
                            ${config.badge}
                          `}
                        >
                          {item.status}
                        </span>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                    </div>

                    {/* Containers Section */}
                    {item.containers && item.containers.length > 0 && (
                      <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-100 space-y-1.5 text-xs">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex justify-between items-center">
                          <span>Containers ({item.containers.length})</span>
                        </div>
                        <div className="space-y-1">
                          {item.containers.slice(0, 2).map((container) => (
                            <div
                              key={container.name}
                              className="flex items-center justify-between gap-2 text-slate-600 text-xs"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-medium text-slate-700 truncate">
                                  {container.container}
                                </span>
                                {container.size && (
                                  <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.2 rounded font-medium shrink-0">
                                    {container.size} FT
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-slate-500 text-[11px] truncate max-w-[90px]">
                                  {container.container_owner || container.owner_name || ''}
                                </span>
                                <span
                                  className={`
                                    inline-flex
                                    rounded-full
                                    px-1.5
                                    py-0.2
                                    text-[9px]
                                    font-semibold
                                    ${
                                      container.status === 'Available'
                                        ? 'bg-green-100 text-green-700'
                                        : container.status === 'Quoted'
                                        ? 'bg-blue-100 text-blue-700'
                                        : container.status === 'Picked Up'
                                        ? 'bg-amber-100 text-amber-700'
                                        : container.status === 'In Transit'
                                        ? 'bg-purple-100 text-purple-700'
                                        : container.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : container.status === 'Rent'
                                        ? 'bg-cyan-100 text-cyan-700'
                                        : 'bg-slate-100 text-slate-700'
                                    }
                                  `}
                                >
                                  {container.status || 'N/A'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {item.containers.length > 2 && (
                          <div className="text-[10px] font-semibold text-[#006B82] pt-0.5">
                            +{item.containers.length - 2} more containers
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-center sm:text-left">
          <div className="text-xs text-slate-500 order-2 sm:order-1">
            Showing{' '}
            {filteredCards.length === 0
              ? 0
              : (currentPage - 1) * pageSize + 1}
            {' '}to{' '}
            {Math.min(
              currentPage * pageSize,
              filteredCards.length
            )}
            {' '}of {filteredCards.length} results
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
        <CreateJobCardModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(newJobCard) => {
            setShowCreateModal(false)
            navigate(`/job-cards/${encodeURIComponent(newJobCard.name)}`)
          }}
        />
      )}
    </AppLayout>
  )
}
