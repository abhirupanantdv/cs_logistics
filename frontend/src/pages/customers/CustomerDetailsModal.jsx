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
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-6xl
          max-h-[90vh]
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            px-6 py-4
            border-b
            border-slate-200
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-cyan-50
                text-cyan-600
                flex items-center justify-center
              "
            >
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Customer Details
              </h2>

              <p className="text-sm text-slate-500">
                {customer.customer_name ||
                  customer.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-9 h-9
              rounded-lg
              hover:bg-slate-100
              flex items-center justify-center
            "
          >
            <X size={18} />
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
                      text-sm
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