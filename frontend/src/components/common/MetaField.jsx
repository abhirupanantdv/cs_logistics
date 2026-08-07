import LinkField from '@/components/common/LinkField'

export default function MetaField({
  field,
  value,
  onChange,
  readOnly = false,
}) {
  const handleChange = (
    newValue
  ) => {
    if (readOnly) return

    onChange(
      field.fieldname,
      newValue
    )
  }

  const label = (
    <label
      className="
        block
        text-xs
        font-medium
        text-slate-600
        mb-1
      "
    >
      {field.label}
    </label>
  )

  if (
    field.fieldtype === 'Select'
  ) {
    return (
      <div>
        {label}

        <select
          value={value || ''}
          disabled={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className="
            w-full
            h-10
            px-3
            border
            border-slate-200
            rounded-lg
            text-sm
          "
        >
          <option value="">
            Select
          </option>

          {field.options
            ?.split('\n')
            ?.filter(Boolean)
            ?.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}
        </select>
      </div>
    )
  }

  if (
    field.fieldtype === 'Check'
  ) {
    return (
      <div className="flex items-center gap-3 pt-7">
        <input
          type="checkbox"
          checked={
            value === 1 ||
            value === true
          }
          onChange={(e) =>
            handleChange(
              e.target.checked
                ? 1
                : 0
            )
          }
        />

        <label>
          {field.label}
        </label>
      </div>
    )
  }

  if (
    field.fieldtype === 'Link'
  ) {
    return (
      <div>
        {label}

        <LinkField
          field={field}
          value={value}
          onChange={(fieldname, val) =>
            handleChange(val)
          }
        />
      </div>
    )
  }

  if (
    [
      'Text',
      'Small Text',
      'Text Editor',
    ].includes(
      field.fieldtype
    )
  ) {
    return (
      <div>
        {label}

        <textarea
          rows={4}
          value={value || ''}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className="
            w-full
            px-3
            py-2
            border
            border-slate-200
            rounded-lg
            text-sm
          "
        />
      </div>
    )
  }

  if (
    field.fieldtype === 'Date'
  ) {
    return (
      <div>
        {label}

        <input
          type="date"
          value={value || ''}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className="
            w-full
            h-10
            px-3
            border
            border-slate-200
            rounded-lg
            text-sm
          "
        />
      </div>
    )
  }

  if (
    field.fieldtype ===
    'Datetime'
  ) {
    return (
      <div>
        {label}

        <input
          type="datetime-local"
          value={value || ''}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className="
            w-full
            h-10
            px-3
            border
            border-slate-200
            rounded-lg
            text-sm
          "
        />
      </div>
    )
  }

  if (
    [
      'Int',
      'Float',
      'Currency',
    ].includes(
      field.fieldtype
    )
  ) {
    return (
      <div>
        {label}

        <input
          type="number"
          value={value || ''}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className="
            w-full
            h-10
            px-3
            border
            border-slate-200
            rounded-lg
            text-sm
          "
        />
      </div>
    )
  }

  return (
    <div>
      {label}

      <input
        type="text"
        value={value || ''}
        onChange={(e) =>
          handleChange(
            e.target.value
          )
        }
        className="
          w-full
          h-10
          px-3
          border
          border-slate-200
          rounded-lg
          text-sm
        "
      />
    </div>
  )
}