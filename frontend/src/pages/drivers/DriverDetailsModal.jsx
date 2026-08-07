//DriverDetailsModal.jsx
import { X, UserCheck } from 'lucide-react'
import { driverDetailsConfig } from '@/config/driverDetailsConfig'
import { formatDate } from '@/utils/date' 

export default function DriverDetailsModal({
  driver,
  onClose,
}) {
  if (!driver) return null

  const fields = driverDetailsConfig
  
  /* FIXED: Added fieldName parameter to catch date fields */
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
    {/* FIXED: Using driver.profile_photo based on your API response structure */}
    {driver.profile_photo ? (
      <img
        src={driver.profile_photo}
        alt={driver.full_name || driver.name}
        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
      />
    ) : (
      <div
        className="
          w-12 h-12
          rounded-xl
          bg-cyan-50
          text-cyan-600
          flex items-center justify-center
        "
      >
        <UserCheck size={22} />
      </div>
    )}

    <div>
      <h2 className="text-lg font-semibold text-slate-800">
        Driver Details
      </h2>
      <p className="text-sm text-slate-500">
        {driver.full_name || driver.name}
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
            p-5
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
              gap-3
            "
          >
            {fields.map((item) => (
              <div
                key={item.field}
                className="
                  bg-white
                  border border-slate-200
                  rounded-xl
                  px-3 py-2.5
                "
              >
                <div
                  className="
                    text-[10px]
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
                    text-slate-800
                    break-words
                  "
                >
                  {/* FIXED: Passed item.field key reference to utility evaluator */}
                  {formatValue(driver[item.field], item.field)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}