//RecentJobCards.jsx
import { useEffect, useState } from 'react'
import {
  ClipboardList,
  Truck,
  FileText,
  Receipt,
  Package,
} from 'lucide-react'
import { getRecentJobCards } from '@/services/jobCardService'

export default function RecentJobCards() {
  const [jobCards, setJobCards] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getRecentJobCards()
      setJobCards(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'

    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getLastOperation = (job) => job.lastOperation || 'Pending'

  const getOperationStyle = (operation) => {
    switch (operation) {
      case 'Gate In':
        return {
          badge: 'bg-blue-100 text-blue-700',
          icon: Package,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        }

      case 'Gate Out':
        return {
          badge: 'bg-green-100 text-green-700',
          icon: Truck,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        }

      case 'Quotation':
        return {
          badge: 'bg-orange-100 text-orange-700',
          icon: FileText,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
        }

      case 'Sales Invoice':
        return {
          badge: 'bg-purple-100 text-purple-700',
          icon: Receipt,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        }

      default:
        return {
          badge: 'bg-slate-100 text-slate-700',
          icon: ClipboardList,
          iconBg: 'bg-slate-100',
          iconColor: 'text-slate-600',
        }
    }
  }

  return (
    <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Recent Job Cards
        </h3>

        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
          View all →
        </button>

        
      </div>

      <div>
        {jobCards.length > 0 ? (
          jobCards.map((job) => {
            const operation = getLastOperation(job)
            const style = getOperationStyle(operation)
            const Icon = style.icon

            return (
              <div
                key={job.name}
                className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-2">
               <div
  className={`flex h-8 w-8 items-center justify-center rounded-md ${style.iconBg}`}
>
  <Icon size={14} className={style.iconColor} />
</div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {job.name}
                    </p>
                  </div>
                </div>

                {/* <div className="hidden flex-1 px-3 text-xs text-slate-700 md:block truncate">
                  {job.customer || '-'}
                </div> */}

                <div className="px-4">
                  <span
  className={`rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${style.badge}`}
>
                    {operation}
                  </span>
                </div>

                <div className="w-24 text-right text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(job.creation)}
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-10 text-center text-sm text-slate-500">
            No recent job cards found
          </div>
        )}
      </div>
    </div>
  )
}