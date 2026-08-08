// src/components/fleet/VehicleDetailsModal.jsx

import { X, Truck } from 'lucide-react'
import { vehicleDetailsConfig } from '@/config/vehicleDetailsConfig'
import { formatDate } from '@/utils/date' 

export default function VehicleDetailsModal({
  vehicle,
  onClose,
}) {
  /* FIXED: Passed fieldName to evaluate date variables cleanly */
  const formatValue = (value, fieldName) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    if (['creation', 'modified'].includes(fieldName)) {
      return formatDate(value)
    }

    return String(value)
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-slate-900/50
        backdrop-blur-sm
        flex items-center justify-center
        p-2 sm:p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-5xl
          max-h-[92vh] sm:max-h-[90vh]
          overflow-hidden
        "
      >
        {/* Header */}

        <div
          className="
            px-4 py-3.5 sm:px-6 sm:py-4
            border-b border-slate-200
            flex items-center justify-between
          "
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-xl
                bg-[#006B82]/10
                flex items-center justify-center
                text-[#006B82]
                shrink-0
              "
            >
              <Truck size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                Vehicle Details
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                {vehicle.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-9 h-9 sm:w-10 sm:h-10
              rounded-xl
              hover:bg-slate-100
              flex items-center justify-center
              shrink-0
              transition-all
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div
          className="
            p-4 sm:p-6
            overflow-y-auto
            max-h-[78vh] sm:max-h-[75vh]
            bg-slate-50/40
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-3 sm:gap-4
            "
          >
            {vehicleDetailsConfig.map((item) => (
              <div
                key={item.field}
                className="
                  bg-white
                  rounded-xl
                  border border-slate-200
                  px-3 py-2.5 sm:px-4 sm:py-3
                "
              >
                <div
                  className="
                    text-[10px] sm:text-[11px]
                    uppercase
                    tracking-wider
                    text-slate-400
                    font-semibold
                    mb-1
                  "
                >
                  {item.label}
                </div>

                <div
                  className="
                    text-xs sm:text-sm
                    font-semibold
                    text-slate-800
                    break-words
                  "
                >
                  {/* FIXED: Passed the structural object identifier tag to filter matching dates */}
                  {formatValue(
                    vehicle[item.field],
                    item.field
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}