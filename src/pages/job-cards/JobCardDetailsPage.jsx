// src/pages/job-cards/JobCardDetailsPage.jsx

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckSquare,
  Clock,
  Package,
} from 'lucide-react'

import AppLayout from '@/components/layout/AppLayout'
import { getJobCardDetails } from '@/services/jobCardService'
import { getContainerDetails } from '@/services/containerService'
import { getFileUrl } from '@/config/constants'
import {
  validateJobCardClosure,
} from '@/services/jobCardClosureService'
import AlertDialog from '../../components/common/AlertDialog'

const ACTION_ITEMS = [
  {
    file: 'QuotationIcon.png',
    label: 'Quotation',
  },
  {
    file: 'GateIn.png',
    label: 'Gate In',
  },
  {
    file: 'GateOut.png',
    label: 'Gate Out',
  },
  {
    file: 'PickupDocket.png',
    label: 'Pickup & Delivery Docket',
  },
  
  {
    file: 'EIR.png',
    label: 'Equipment Interchange Receipt',
  },
  {
    file: 'SalesInvoice.png',
    label: 'Sales Invoice',
  },
]

export default function JobCardDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [jobCard, setJobCard] = useState(null)
  const [containers, setContainers] = useState([])
  const [selectedContainers, setSelectedContainers] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [alertDialog, setAlertDialog] =
  useState({
    open: false,
    title: '',
    message: '',
  })
  
  const getContainerKey = (container, index) =>
    container.container_number || container.name || String(index)

  useEffect(() => {
    const fetchJobCardDetails = async () => {
      try {
        const data = await getJobCardDetails(id)

        console.log('Job Card Details:', data)

        setJobCard(data)

        if (
          data?.container &&
          Array.isArray(data.container) &&
          data.container.length > 0
        ) {
          const containerNames = data.container
            .map((row) => row.container)
            .filter(Boolean)

          console.log(
            'Container Names in Job Card:',
            containerNames
          )

          const allContainerDetails = await Promise.all(
            containerNames.map((containerName) =>
              getContainerDetails(containerName)
            )
          )

          console.log(
            'All Container Details:',
            allContainerDetails
          )

          setContainers(allContainerDetails)

          if (allContainerDetails.length > 0) {
            const firstKey = getContainerKey(allContainerDetails[0], 0)
            setSelectedContainers(new Set([firstKey]))
          }
        }
      } catch (error) {
        console.error('Error fetching job card details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJobCardDetails()
    }
  }, [id])

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatOperationTime = (timeStr, creationStr) => {
    const target = timeStr || creationStr
    if (!target) return 'N/A'
    const normalized = target.includes(' ') && !target.includes('T')
      ? target.replace(' ', 'T')
      : target
    const parsed = new Date(normalized)
    if (isNaN(parsed.getTime())) {
      return target
    }
    return parsed.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const sortedOperations =
    jobCard?.operations &&
    Array.isArray(jobCard.operations)
      ? [...jobCard.operations].sort(
          (a, b) =>
            new Date(b.creation) - new Date(a.creation)
        )
      : []

  const filteredOperations = sortedOperations.filter((operation) => {
    if (selectedContainers.size === 0) return true

    const opContainersStr = operation.containers
    if (opContainersStr) {
      return Array.from(selectedContainers).some((selectedKey) => {
        const normalizedKey = selectedKey.toLowerCase().trim()
        return opContainersStr.toLowerCase().includes(normalizedKey)
      })
    }
    return true
  })

  const latestOperation = sortedOperations[0]

  const handleContainerToggle = (container, index) => {
    const key = getContainerKey(container, index)
    setSelectedContainers((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleOperationClick = (operation) => {
    // if (selectedContainers.size === 0) {
    //   window.alert(
    //     'Please select at least one container before choosing an operation.'
    //   )
    //   return
    // }
    if (selectedContainers.size === 0) {
  setAlertDialog({
    open: true,
    title: 'Container Required',
    message:
      'Please select at least one container before choosing an operation.',
  })

  return
}
   if (
  selectedContainers.size > 1 &&
  operation ===
    'Equipment Interchange Receipt'
) {
  setAlertDialog({
    open: true,
    title: 'Invalid Selection',
    message:
      'Equipment Interchange Receipt can only be created for one container at a time.',
  })

  return
}

    const query = new URLSearchParams({
      operation,
      containers: JSON.stringify([...selectedContainers]),
      jobCardName: jobCard?.name ?? '',
    }).toString()

    navigate(`/job-cards/${id}/operations?${query}`)
  }

  const isActionActive = (label) =>
    label === latestOperation?.operation_type

  const isSelectedContainer = (container, index) =>
    selectedContainers.has(getContainerKey(container, index))

  const handleCloseJobCard = async () => {
    try {
      const isValid =
        await validateJobCardClosure()

      if (!isValid) {
        return
      }

      console.log(
        'Job Card can be closed'
      )

      // future API call here

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AppLayout
      title="Job Card Details"
      description={
        jobCard?.name
          ? `Details for ${jobCard.name}`
          : 'View job card details'
      }
    >
      <div className="max-w-[1350px] mx-auto space-y-5 pb-6">
        
{/* Main Section */}
<div
  className="
    grid
    gap-5
    lg:grid-cols-[240px_320px_minmax(0,1fr)]
    items-start
  "
>
  {/* Containers */}
<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[560px] flex flex-col">
    <div className="px-5 py-4 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Containers ({containers.length})
        </h2>

        <span className="text-xs font-semibold text-[#006B82] bg-[#006B82]/10 px-2 py-1 rounded-full">
          {selectedContainers.size}
        </span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {containers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
          No container details available.
        </div>
      ) : (
        containers.map((container, index) => {
          const isSelected = isSelectedContainer(container, index)

          return (
            <label
              key={getContainerKey(container, index)}
              className={`
                flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-all
                ${
                  isSelected
                    ? 'border-[#006B82] bg-[#006B82]/5'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }
              `}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() =>
                  handleContainerToggle(container, index)
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#006B82]"
              />

              <div className="min-w-0 flex-1">
                <div
                  className={`text-[13px] font-bold ${
                    isSelected
                      ? 'text-[#006B82]'
                      : 'text-slate-800'
                  }`}
                >
                  {container.container_number ||
                    container.name}
                </div>

                <div className="mt-1 text-[10px] text-slate-500 uppercase">
                  {container.item || 'N/A'}
                </div>

                {container.size && (
                  <div className="text-[10px] text-slate-400">
                    {container.size} FT
                  </div>
                )}
              </div>
            </label>
          )
        })
      )}
    </div>
  </div>

  {/* Operations */}
<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[560px] flex flex-col">
    <div className="px-5 py-4 border-b border-slate-100">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
        Available Operations
      </h2>
    </div>

    <div className="p-3 flex-1">
  <div className="grid grid-cols-2 gap-2">
        {ACTION_ITEMS.map((item) => {
          const active = isActionActive(item.label)

          return (
            <button
              key={item.file}
              type="button"
              onClick={() =>
                handleOperationClick(item.label)
              }
             className={`
  relative flex flex-col items-center justify-center gap-3
  rounded-lg border p-3 h-[105px]
  transition-all duration-200
  ${
    active
      ? 'border-emerald-500 bg-emerald-50'
      : 'border-slate-200 bg-white hover:bg-slate-50'
  }
`}
            >
             <img
  src={getFileUrl(item.file)}
  alt={item.label}
  className="h-10 w-10 object-contain"
/>

              <span
                className={`
                  text-xs
                  font-semibold
                  text-center
                  leading-tight
                  ${
                    active
                      ? 'text-emerald-800'
                      : 'text-slate-700'
                  }
                `}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  </div>

  {/* Activity History */}
<div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[560px] flex flex-col">
    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Operation History
        </p>

        <h2 className="mt-1 text-base font-bold text-slate-900">
          Latest Activity
        </h2>
      </div>

      <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
        {filteredOperations.length} records
      </div>
    </div>

    <div className="flex-1 overflow-auto">
      {filteredOperations.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-400">
          No operation logs found.
        </div>
      ) : (
        <table className="min-w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operation
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                ID
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Containers
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Time
              </th>

              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredOperations.map((operation) => (
              <tr
                key={operation.name}
                className="hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                      <CheckSquare className="h-3.5 w-3.5" />
                    </span>

                    <div>
                      <div className="text-xs font-semibold text-slate-800">
                        {operation.operation_name ||
                          operation.operation_type ||
                          'N/A'}
                      </div>

                      <div className="text-[10px] text-slate-400">
                        {operation.owner || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  {operation.operation || 'N/A'}
                </td>

                <td className="px-4 py-3 text-xs text-slate-600">
                  {operation.containers || 'N/A'}
                </td>

                <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  {formatOperationTime(
                    operation.time,
                    operation.creation
                  )}
                </td>

                <td className="px-4 py-3 text-xs text-slate-500">
                  {operation.remarks || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
</div>
        </div>
<AlertDialog
  open={alertDialog.open}
  title={alertDialog.title}
  message={alertDialog.message}
  onClose={() =>
    setAlertDialog((prev) => ({
      ...prev,
      open: false,
    }))
  }
/>
    </AppLayout>
  )
}
