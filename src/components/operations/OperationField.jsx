// OperationField.jsx

import LinkField from '@/components/common/LinkField'
import {
  labelClass,
  underlineInputClass,
  underlineTextareaClass,
} from '@/components/common/formClasses'
import OperationTableField from './OperationTableField'

import {
  isFieldReadOnly,
} from './operationHelpers'

export default function OperationField({
  field,
  value,
  formData,
  operation,
  jobCardField,
  onChange,
  tableMeta,
}) {
 let readOnly =
  isFieldReadOnly({
    field,
    operation,
    jobCardField,
  })

if (
  field.fieldname === 'custom_container' ||
  field.fieldname === 'custom_container_info'
) {
  console.log(
    'CUSTOM CONTAINER VALUE',
    formData[field.fieldname]
  )
}

if (
  field.fieldname ===
  'posting_time'
) {
  readOnly =
    !formData?.set_posting_time
}
  const handleChange = (
    newValue
  ) => {
    if (readOnly) return

    onChange(
      field.fieldname,
      newValue
    )
  }

  const fieldStateClass = readOnly
    ? 'text-slate-500 cursor-not-allowed'
    : 'text-slate-900'

  const inputClass = `${underlineInputClass} ${fieldStateClass}`

  const textareaClass = `${underlineTextareaClass} ${fieldStateClass}`

const label = (
  <label
    data-source="operation-field"
    className={labelClass}
  >
    {field.label}
  </label>
)

  /*
  SELECT
  */
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
          className={
            inputClass
          }
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

  /*
  LINK
  */
  if (
    field.fieldtype === 'Link'
  ) {
    if (readOnly) {
      return (
        <div>
          {label}

          <input
            type="text"
            readOnly
            value={value || ''}
            className={
              inputClass
            }
          />
        </div>
      )
    }

    return (
      <div>
        {label}

        <LinkField
          field={field}
          value={value}
          onChange={onChange}
        />
      </div>
    )
  }

  /*
  TEXTAREA
  */
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
          readOnly={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className={
            textareaClass
          }
        />
      </div>
    )
  }

  /*
  CHECKBOX
  */
  if (
    field.fieldtype === 'Check'
  ) {
    return (
      <div>
        <label
          className="
            flex
            items-center
            gap-3
            text-sm
            font-medium
            text-slate-700
          "
        >
          <input
            type="checkbox"
            disabled={
              readOnly
            }
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
            className="
              h-4
              w-4
            "
          />

          {field.label}
        </label>
      </div>
    )
  }

  /*
ATTACH
*/
if (field.fieldtype === 'Attach') {
  return (
    <div>
      {label}

      <label
        className={`
          flex
          items-center
          justify-between
          px-4
          py-3
          rounded-lg
          border
          border-slate-300
          bg-white
          cursor-pointer
          transition-all
          hover:border-[#006B82]
          hover:bg-slate-50
          ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#006B82]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.757 10.757a6 6 0 108.486 8.486L20 13"
            />
          </svg>

          <div>
            <p className="text-sm font-medium text-slate-700">
              {value?.name || 'Choose File'}
            </p>

            <p className="text-xs text-slate-500">
              PDF, JPG, PNG, DOCX
            </p>
          </div>
        </div>

        <span
          className="
            rounded-md
            bg-[#006B82]
            px-3
            py-1.5
            text-xs
            font-medium
            text-white
          "
        >
          Browse
        </span>

        <input
          type="file"
          disabled={readOnly}
          className="hidden"
          onChange={(e) =>
            handleChange(
              e.target.files?.[0] || null
            )
          }
        />
      </label>
    </div>
  )
}

/*
TABLE
*/
if (field.fieldtype === 'Table') {
  // console.log(
  //   'TABLE FIELD DATA',
  //   field.fieldname,
  //   formData[field.fieldname]
  // )

  return (
//     <OperationTableField
//   field={field}
//   value={
//     formData?.[
//       field.fieldname
//     ] || []
//   }
//   meta={
//     tableMeta[
//       field.fieldname
//     ]
//   }
//   serviceType={
//     formData?.custom_service_type
//   }
//   onChange={(rows) =>
//     onChange(
//       field.fieldname,
//       rows
//     )
//   }
// />
<OperationTableField
  field={field}
  value={
    formData?.[
      field.fieldname
    ] || []
  }
  meta={
    tableMeta[
      field.fieldname
    ]
  }
  serviceType={
    formData?.custom_service_type
  }
  operation={operation}
  onChange={(rows) =>
    onChange(
      field.fieldname,
      rows
    )
  }
/>
  )
}
  /*
  DATE
  */
  if (
    field.fieldtype === 'Date'
  ) {
    return (
      <div>
        {label}

        <input
          type="date"
          value={value || ''}
          readOnly={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className={
            inputClass
          }
        />
      </div>
    )
  }

  /*
  DATETIME
  */
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
          readOnly={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className={
            inputClass
          }
        />
      </div>
    )
  }

  /*
  TIME
  */
  if (
    field.fieldtype === 'Time'
  ) {
    return (
      <div>
        {label}

        <input
          type="time"
          step="1"
          value={value || ''}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className={
            inputClass
          }
        />
      </div>
    )
  }

  /*
  NUMBERS
  */
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
          readOnly={readOnly}
          onChange={(e) =>
            handleChange(
              e.target.value
            )
          }
          className={
            inputClass
          }
        />
      </div>
    )
  }

  /*
  DEFAULT INPUT
  */
  return (
    <div>
      {label}

      <input
        type="text"
        value={value || ''}
        readOnly={readOnly}
        onChange={(e) =>
          handleChange(
            e.target.value
          )
        }
        className={
          inputClass
        }
      />
    </div>
  )
}
