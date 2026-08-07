import { useEffect, useState } from 'react'
import {
  Truck,
  Package,
} from 'lucide-react'

import {
  getUpcomingPickupDeliveries,
} from '@/services/pickupDeliveryService'

const getStatusStyle = (status) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-700'

    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'

    default:
      return 'bg-blue-100 text-blue-700'
  }
}

export default function UpcomingDeliveriesPickups() {
  const [data, setData] = useState([])

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
  try {
    const response =
      await getUpcomingPickupDeliveries()

    const now = new Date()

    const upcoming = response
  .map((item) => {
    const scheduleDate =
      item.docket_type === 'Pickup'
        ? item.pickup_date_time
        : item.delivery_date_time

    return {
      ...item,
      scheduleDate,
    }
  })
  .filter((item) => {
    if (!item.scheduleDate) return false

    return (
      new Date(item.scheduleDate).getTime() >
      Date.now()
    )
  })
  .sort(
    (a, b) =>
      new Date(a.scheduleDate).getTime() -
      new Date(b.scheduleDate).getTime()
  )

setData(upcoming.slice(0, 5))
  } catch (error) {
    console.error(error)
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'

  return new Date(dateStr).toLocaleString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  )
}

 return (
  <div
  className="
    h-full
    flex
    flex-col
    rounded-2xl
    border
    border-slate-200
    bg-white
    p-4
    shadow-sm
  "
>
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-slate-900">
        Upcoming Deliveries & Pickups
      </h3>

      {/* <p className="mt-0.5 text-xs text-slate-500">
        Next 5 scheduled movements
      </p> */}
    </div>

    <div className="overflow-hidden rounded-lg border border-slate-200">
      {/* Header */}
      <div
        className="
          grid
          grid-cols-[1.2fr_0.8fr_1fr_1.5fr]
          gap-3
          bg-slate-50
          px-3
          py-2
          text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-slate-600
        "
      >
        <div>ID</div>
        <div>Type</div>
        <div>Job Card</div>
        <div>Date & Time</div>
      </div>

      {/* Rows */}
      {data.map((item) => {
        const isDelivery =
          item.docket_type === 'Delivery'

        return (
          <div
            key={item.name}
            className="
              grid
              grid-cols-[1.2fr_0.8fr_1fr_1.5fr]
              gap-3
              border-t
              border-slate-100
              px-3
              py-2
              text-xs
              hover:bg-slate-50
            "
          >
            {/* ID */}
            <div className="font-medium text-slate-800 truncate">
              {item.name}
            </div>

            {/* Type */}
            <div>
              <span
                className={`
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  px-2
                  py-0.5
                  text-[10px]
                  font-medium
                  ${
                    isDelivery
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }
                `}
              >
                {isDelivery ? (
                  <Truck size={10} />
                ) : (
                  <Package size={10} />
                )}

                {item.docket_type}
              </span>
            </div>

            {/* Job Card */}
            <div className="text-slate-600 truncate">
              {item.job_card_number || '-'}
            </div>

            {/* Date */}
            <div className="text-slate-700 whitespace-nowrap">
              {formatDateTime(item.scheduleDate)}
            </div>
          </div>
        )
      })}

      {data.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-500">
          No upcoming deliveries or pickups
        </div>
      )}
    </div>
  </div>
)
}