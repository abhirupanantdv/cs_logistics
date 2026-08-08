//CustomerDetailsModal.jsx
import { X, Building2 } from 'lucide-react'
import { formatDate } from '../../utils/date'

export default function CustomerDetailsModal({
  customer,
  onClose,
}) {
  if (!customer) return null

  const fields = Object.entries(customer)
    .filter(
      ([key, value]) =>
        !Array.isArray(value) &&
        typeof value !== 'object'
    )
    .sort((a, b) =>
      a[0].localeCompare(b[0])
    )

  const formatLabel = (field) =>
    field
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) =>
        c.toUpperCase()
      )

  /* FIXED: Adjusted formatValue to catch the 'creation' field and format it */
  const formatValue = (value, fieldName) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    // FIXED: Formats both 'creation' and 'modified' fields using your global utility
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
          max-w-6xl
          max-h-[92vh] sm:max-h-[90vh]
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-4 py-3.5 sm:px-6 sm:py-4
            border-b
            border-slate-200
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-xl
                bg-cyan-50
                text-cyan-600
                flex items-center justify-center
                shrink-0
              "
            >
              <Building2 size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-slate-800 text-base sm:text-lg truncate">
                Customer Details
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 truncate">
                {customer.customer_name ||
                  customer.name}
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
            {fields.map(
              ([field, value]) => (
                <div
                  key={field}
                  className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    px-3
                    py-2.5
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
                    {formatLabel(field)}
                  </div>

                  <div
                    className="
                      text-xs sm:text-sm
                      text-slate-800
                      break-words
                    "
                  >
                    {/* FIXED: Passed the field identifier name to formatValue helper */}
                    {formatValue(value, field)}
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