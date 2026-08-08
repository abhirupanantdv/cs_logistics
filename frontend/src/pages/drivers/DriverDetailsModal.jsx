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
            {/* FIXED: Using driver.profile_photo based on your API response structure */}
            {driver.profile_photo ? (
              <img
                src={driver.profile_photo}
                alt={driver.full_name || driver.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
            ) : (
              <div
                className="
                  w-10 h-10 sm:w-12 sm:h-12
                  rounded-xl
                  bg-cyan-50
                  text-cyan-600
                  flex items-center justify-center
                  shrink-0
                "
              >
                <UserCheck size={20} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                Driver Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 truncate">
                {driver.full_name || driver.name}
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
            p-4 sm:p-5
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
              gap-3
            "
          >
            {fields.map((item) => {
              const val = driver[item.field]
              const isFile =
                typeof val === 'string' &&
                (val.startsWith('/files/') ||
                  val.startsWith('http://') ||
                  val.startsWith('https://') ||
                  /\.(jpg|jpeg|png|webp|gif|pdf)$/i.test(val))

              if (isFile) {
                const isImage =
                  /\.(jpg|jpeg|png|webp|gif)$/i.test(val) ||
                  val.startsWith('data:image') ||
                  item.field === 'profile_photo'

                return (
                  <div
                    key={item.field}
                    className="
                      col-span-full
                      bg-white
                      border border-slate-200
                      rounded-xl
                      px-4 py-3
                    "
                  >
                    <div
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-slate-400
                        font-semibold
                        mb-2
                      "
                    >
                      {item.label}
                    </div>

                    {isImage ? (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <img
                          src={val}
                          alt={item.label}
                          className="
                            h-20 w-20 sm:h-24 sm:w-24
                            object-cover
                            rounded-xl
                            border
                            border-slate-200
                            shadow-sm
                            cursor-pointer
                            hover:opacity-90
                          "
                          onClick={() => window.open(val, '_blank')}
                        />
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate max-w-xs sm:max-w-md">
                            {val.split('/').pop()}
                          </p>
                          <a
                            href={val}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#006B82] hover:underline"
                          >
                            View Full Image ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <a
                        href={val}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-2
                          px-3 py-2
                          rounded-lg
                          bg-slate-100
                          text-xs
                          font-medium
                          text-[#006B82]
                          hover:bg-slate-200
                          transition-all
                        "
                      >
                        <span>📎 {val.split('/').pop()}</span>
                        <span>View File ↗</span>
                      </a>
                    )}
                  </div>
                )
              }

              return (
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
                      text-xs sm:text-sm
                      text-slate-800
                      break-words
                    "
                  >
                    {formatValue(val, item.field)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}