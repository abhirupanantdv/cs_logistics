
// OperationTableField.jsx
import LinkField from '@/components/common/LinkField'

function TableCell({
  field,
  value,
  onChange,
}) {
  const isReadOnly =
    [
      'container',
      'container_owner',
      'type',
      'status',
    ].includes(field.fieldname)

  if (isReadOnly) {
    return (
      <div
        className="
          px-3
          py-1.5
          rounded-md
          bg-slate-50
          border
          border-slate-200
          text-xs
          text-slate-700
          min-h-9
          flex
          items-center
        "
      >
        {value || '-'}
      </div>
    )
  }

  switch (field.fieldtype) {
    case 'Link':
      return (
        <LinkField
          field={field}
          value={value}
          onChange={(_, val) =>
            onChange(val)
          }
        />
      )

    case 'Select':
      return (
        <select
          value={value || ''}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            w-full
            rounded-md
            border
            border-slate-300
            px-2
            py-1.5
            text-xs
          "
        >
          <option value="">
            Select
          </option>

          {field.options
            ?.split('\n')
            ?.filter(Boolean)
            ?.map(option => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
        </select>
      )

    case 'Check':
      return (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) =>
            onChange(
              e.target.checked ? 1 : 0
            )
          }
        />
      )

    default:
      return (
        <input
          value={value || ''}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          className="
            w-full
            rounded-md
            border
            border-slate-300
            px-2
            py-1.5
            text-xs
          "
        />
      )
  }
}

const shouldShowColumn = (
  column,
  serviceType,
  operation
) => {
  // For Sales Invoice (or any non-Quotation document)
  // ignore ERP display depends on and show all columns
  if (
    operation !== 'Quotation'
  ) {
    return true
  }

  const expression =
    column.depends_on ||
    column.display_depends_on

  if (!expression) {
    return true
  }

  const normalized =
    expression.replaceAll(
      '\n',
      ' '
    )

  const matches = [
    ...normalized.matchAll(
      /custom_service_type\s*==\s*"([^"]+)"/g
    ),
  ]

  if (!matches.length) {
    return true
  }

  const allowedValues =
    matches.map(
      match => match[1]
    )

  return allowedValues.includes(
    serviceType
  )
}

export default function OperationTableField({
  field,
  value = [],
  meta,
  onChange,
  serviceType,
  operation,
})  {
  if (!meta) {
    return (
      <div>
        <label
          className="
            text-xs
            font-medium
            text-slate-700
          "
        >
          {field.label}
        </label>

        <div
          className="
            mt-2
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            p-3
            text-xs
            text-slate-500
          "
        >
          Loading table...
        </div>
      </div>
    )
  }

  const columns = meta.fields.filter(f => {
    const visible = shouldShowColumn(
      f,
      serviceType,
      operation
    )

    return (
      !f.hidden &&
      f.in_list_view &&
      f.fieldtype !== 'Section Break' &&
      visible
    )
  })

  const updateCell = (
    rowIndex,
    fieldname,
    newValue
  ) => {
    const updated = [...value]

    updated[rowIndex] = {
      ...updated[rowIndex],
      [fieldname]: newValue,
    }

    onChange(updated)
  }

  return (
    <div>
      <label
        className="
          text-sm
          font-medium
          text-slate-700
        "
      >
        {field.label}
      </label>

      {!value?.length ? (
        <div
          className="
            mt-2
            rounded-lg
            border
            border-slate-200
            bg-slate-50
            p-4
            text-sm
            text-slate-500
          "
        >
          No records found
        </div>
      ) : (
        <div
          className="
            mt-2
            overflow-x-auto
            rounded-lg
            border
            border-slate-200
            bg-white
          "
        >
          <table
            className="
              min-w-full
              border-collapse
            "
          >
            <thead>
              <tr
                className="
                  bg-slate-50
                  border-b
                  border-slate-200
                "
              >
                {columns.map((column) => (
                  <th
                    key={column.fieldname}
                    className="
                      whitespace-nowrap
                      px-3
                      py-2.5
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-600
                      border-b
                      border-slate-200
                    "
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {value.map((row, rowIndex) => (
                <tr
                  key={row.name || rowIndex}
                  className="hover:bg-slate-50/50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.fieldname}
                      className="
                        p-2
                        align-middle
                        border-b
                        border-slate-100
                      "
                    >
                      <TableCell
                        field={column}
                        value={row[column.fieldname]}
                        onChange={(val) =>
                          updateCell(
                            rowIndex,
                            column.fieldname,
                            val
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}