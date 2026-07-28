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
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-5xl
          max-h-[90vh]
          overflow-hidden
        "
      >
        {/* Header */}

        <div
          className="
            px-6 py-4
            border-b border-slate-200
            flex items-center justify-between
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-[#006B82]/10
                flex items-center justify-center
                text-[#006B82]
              "
            >
              <Truck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Vehicle Details
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {vehicle.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl
              hover:bg-slate-100
              flex items-center justify-center
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div
          className="
            p-6
            overflow-y-auto
            max-h-[75vh]
            bg-slate-50/40
          "
        >
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-4
            "
          >
            {vehicleDetailsConfig.map(
              (item) => (
                <div
                  key={item.field}
                  className="
                    bg-white
                    rounded-xl
                    border border-slate-200
                    px-4 py-3
                  "
                >
                  <div
                    className="
                      text-[11px]
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
                      text-sm
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}