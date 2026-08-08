//OperationRecordDetailsModal.jsx
import {
  X,
  FileText,
  Package,
} from 'lucide-react'

import { operationDetailsConfig } from '@/config/operationDetailsConfig'
import { formatDate } from '@/utils/date' // FIXED: Imported your global date formatter

export default function OperationDetailsModal({
  operationType,
  record,
  onClose,
}) {
  const fields =
    operationDetailsConfig[
      operationType
    ] || []

  /* FIXED: Added fieldName evaluation logic for dates */
  const formatValue = (
    value,
    fieldName
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    if (['creation', 'modified', 'transaction_date', 'valid_till', 'date', 
      'datetime_of_interchange', 'due_date', 'posting_date'].includes(fieldName)) {
      return formatDate(value)
    }

    return String(value)
  }

  const formatLabel = (
    field
  ) =>
    field
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) =>
        c.toUpperCase()
      )

  const containers = [
    ...(record.container || []),
    ...(record.custom_container || []),
    ...(record.custom_container_info || []),
  ]
  const showItemsTable = [
    'Sales Invoice',
    'Quotation',
  ].includes(operationType)
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
              <FileText size={20} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  text-base sm:text-lg
                  font-semibold
                  text-slate-800
                  truncate
                "
              >
                {operationType}
              </h2>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-500
                  mt-0.5
                  truncate
                "
              >
                Record ID: {record.name}
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
              transition-all
              shrink-0
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
          {/* Details Section */}

          <div className="mb-6 sm:mb-8">
            <div
              className="
                flex items-center gap-2
                mb-4 sm:mb-5
              "
            >
              <FileText
                size={18}
                className="text-[#006B82]"
              />

              <h3
                className="
                  text-base sm:text-lg
                  font-semibold
                  text-slate-800
                "
              >
                Operation Details
              </h3>
            </div>

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
              {fields
                .filter((item) => {
                  if (
                    item.field === 'storage_start'
                  ) {
                    return (
                      String(
                        record.storage_start
                      ) === '1'
                    )
                  }

                  return true
                })
                .map((item) => (
                  <div
                    key={item.field}
                    className={`
                      bg-white
                      rounded-xl
                      border border-slate-200
                      px-4 py-3
                      ${
                        item.field ===
                        'damage_annotation_image'
                          ? 'col-span-full'
                          : ''
                      }
                    `}
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
                      {item.field ===
                      'storage_start' ? (
                        '✓ Yes'
                      ) : item.field ===
                          'damage_annotation_image' &&
                        record[item.field] ? (
                        <img
                          src={record[item.field]}
                          alt="Damage Annotation"
                          className="
                            w-full
                            max-h-[300px]
                            object-contain
                            rounded-lg
                            border
                            border-slate-200
                            cursor-pointer
                            bg-slate-50
                          "
                          onClick={() =>
                            window.open(
                              record[item.field],
                              '_blank'
                            )
                          }
                        />
                      ) : (
                        /* FIXED: Sent item.field argument along with structural value parameter */
                        formatValue(
                          record[item.field],
                          item.field
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Containers */}

          {containers.length > 0 && (
            <div>
              <div
                className="
                  flex items-center gap-2
                  mb-4 sm:mb-5
                "
              >
                <Package
                  size={18}
                  className="text-[#006B82]"
                />

                <h3
                  className="
                    text-base sm:text-lg
                    font-semibold
                    text-slate-800
                  "
                >
                  Containers
                </h3>

                <span
                  className="
                    px-2 py-0.5
                    text-xs
                    rounded-full
                    bg-[#006B82]/10
                    text-[#006B82]
                    font-medium
                  "
                >
                  {containers.length}
                </span>
              </div>

              <div
                className="
                  bg-white
                  rounded-2xl
                  border border-slate-200
                  overflow-x-auto
                "
              >
                <div className="min-w-[360px]">
                  {/* Header */}
                  <div
                    className="
                      grid
                      grid-cols-3
                      bg-slate-50
                      border-b border-slate-200
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    <div className="px-4 py-3 sm:px-6 sm:py-4">
                      Container No
                    </div>

                    <div className="px-4 py-3 sm:px-6 sm:py-4">
                      Owner
                    </div>

                    <div className="px-4 py-3 sm:px-6 sm:py-4">
                      Type
                    </div>
                  </div>

                  {/* Rows */}
                  {containers.map(
                    (
                      container,
                      index
                    ) => (
                      <div
                        key={index}
                        className="
                          grid
                          grid-cols-3
                          border-b border-slate-100
                          last:border-0
                          hover:bg-slate-50
                          transition-all
                        "
                      >
                        <div
                          className="
                            px-4 py-3 sm:px-6 sm:py-4
                            font-medium
                            text-slate-800
                            text-xs sm:text-sm
                          "
                        >
                          {container.container ||
                            '-'}
                        </div>

                        <div
                          className="
                            px-4 py-3 sm:px-6 sm:py-4
                            text-slate-600
                            text-xs sm:text-sm
                          "
                        >
                          {container.container_owner ||
                            '-'}
                        </div>

                        <div
                          className="
                            px-4 py-3 sm:px-6 sm:py-4
                            text-slate-600
                            text-xs sm:text-sm
                          "
                        >
                          {container.type ||
                            '-'}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {showItemsTable &&
            record.items?.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Package
                    size={16}
                    className="text-[#006B82]"
                  />

                  <h3 className="text-sm font-semibold text-slate-800">
                    Invoice Items
                  </h3>

                  <span
                    className="
                      px-2 py-0.5
                      rounded-full
                      text-[10px]
                      font-medium
                      bg-[#006B82]/10
                      text-[#006B82]
                    "
                  >
                    {record.items.length}
                  </span>
                </div>

                <div
                  className="
                    bg-white
                    rounded-xl
                    border border-slate-200
                    overflow-x-auto
                  "
                >
                  <div className="min-w-[480px]">
                    {/* Header */}
                    <div
                      className="
                        grid
                        grid-cols-[2fr_80px_120px_120px]
                        bg-slate-50
                        border-b border-slate-200
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
                      <div className="px-4 py-2.5">
                        Item
                      </div>

                      <div className="px-4 py-2.5 text-center">
                        Qty
                      </div>

                      <div className="px-4 py-2.5 text-right">
                        Rate
                      </div>

                      <div className="px-4 py-2.5 text-right">
                        Amount
                      </div>
                    </div>

                    {/* Rows */}
                    {record.items.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="
                            grid
                            grid-cols-[2fr_80px_120px_120px]
                            border-b border-slate-100
                            last:border-0
                            hover:bg-slate-50
                          "
                        >
                          <div className="px-4 py-3">
                            <div className="font-medium text-slate-800 text-sm">
                              {item.item_name}
                            </div>

                            {item.description && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>

                          <div className="px-4 py-3 text-center text-sm text-slate-700">
                            {item.qty}
                          </div>

                          <div className="px-4 py-3 text-right text-sm text-slate-700">
                            PGK {Number(item.rate).toLocaleString()}
                          </div>

                          <div className="px-4 py-3 text-right font-semibold text-slate-800">
                            PGK {Number(item.amount).toLocaleString()}
                          </div>
                        </div>
                      )
                    )}

                    {/* Footer Total */}
                    <div
                      className="
                        flex
                        justify-end
                        gap-10
                        px-4
                        py-3
                        bg-slate-50
                        border-t border-slate-200
                      "
                    >
                      <span className="font-medium text-slate-600">
                        Grand Total
                      </span>

                      <span className="font-semibold text-slate-800">
                        PGK {Number(record.grand_total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}