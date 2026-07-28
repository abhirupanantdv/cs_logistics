import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Truck,
  X,
  Search,
} from 'lucide-react'

import LinkField from '../common/LinkField'
import {
  labelClass,
  underlineInputClass,
  underlineTextareaClass,
} from '../common/formClasses'

import {
  getVehicleMeta,
  createVehicle,
} from '@/services/vehicleService'

const EXCLUDED_FIELDS = [
  'name',
  'owner',
  'creation',
  'modified',
  'modified_by',
  'idx',
  'docstatus',
  'amended_from',
  'naming_series',
]

const SUPPORTED_FIELD_TYPES = [
  'Data',
  'Select',
  'Date',
  'Datetime',
  'Check',
  'Link',
  'Small Text',
  'Text',
  'Int',
]

export default function CreateFleetModal({
  onClose,
  onCreated,
}) {
  const [fields, setFields] =
    useState([])

  const [formData, setFormData] =
    useState({})

  const [loadingMeta, setLoadingMeta] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  useEffect(() => {
    fetchMeta()
  }, [])

  const fetchMeta = async () => {
    try {
      setLoadingMeta(true)

      const meta =
        await getVehicleMeta()

      const filtered =
        meta.fields.filter(
          (field) =>
            field.fieldname &&
            !field.hidden &&
            !field.read_only &&
            !field.is_virtual &&
            SUPPORTED_FIELD_TYPES.includes(
              field.fieldtype
            ) &&
            !EXCLUDED_FIELDS.includes(
              field.fieldname
            )
        )

      setFields(filtered)

      const initialData = {}

      filtered.forEach(
        (field) => {
          initialData[
            field.fieldname
          ] =
            field.fieldtype ===
            'Check'
              ? 0
              : field.default || ''
        }
      )

      setFormData(initialData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingMeta(false)
    }
  }

  const handleChange = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }


  
  const handleSubmit =
    async (e) => {
      e.preventDefault()
      console.log(
  'Vehicle Payload:',
  formData
)

      try {
        setSaving(true)
        

        const created =
          await createVehicle(
            formData
          )

        onCreated?.(created)

        onClose()
      } catch (error) {
  console.error(
    'Vehicle Creation Error:',
    error.response?.data
  )

  alert(
    error.response?.data?.exception ||
    error.response?.data?.message ||
    'Failed to create vehicle'
  )
} finally {
        setSaving(false)
      }
    }

  const leftFields =
    useMemo(
      () => fields,
      [fields]
    )

  const renderInput = (
    field
  ) => {
    const value =
      formData[
        field.fieldname
      ] ?? ''

    if (
      field.fieldtype === 'Check'
    ) {
      return (
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(
              value
            )}
            onChange={(e) =>
              handleChange(
                field.fieldname,
                e.target.checked
                  ? 1
                  : 0
              )
            }
          />

          <span className="text-sm">
            {field.label}
          </span>
        </label>
      )
    }

    if (
  field.fieldtype === 'Link'
) {
  return (
    <>
      <label className={labelClass}>
        {field.label}
      </label>

      <LinkField
        field={field}
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

    if (
      field.fieldtype ===
      'Select'
    ) {
      const options =
        field.options
          ?.split('\n')
          ?.filter(Boolean) ||
        []

      return (
        <>
          <label className={labelClass}>
            {field.label}
          </label>

          <select
            value={value}
            onChange={(e) =>
              handleChange(
                field.fieldname,
                e.target.value
              )
            }
            className={underlineInputClass}
          >
            <option value="">
              Select
            </option>

            {options.map(
              (option) => (
                <option
                  key={option}
                  value={
                    option
                  }
                >
                  {option}
                </option>
              )
            )}
          </select>
        </>
      )
    }

    if (
      field.fieldtype ===
        'Text' ||
      field.fieldtype ===
        'Small Text'
    ) {
      return (
        <>
          <label className={labelClass}>
            {field.label}
          </label>

          <textarea
            rows={3}
            value={value}
            onChange={(e) =>
              handleChange(
                field.fieldname,
                e.target.value
              )
            }
            className={underlineTextareaClass}
          />
        </>
      )
    }

    return (
      <>
        <label className={labelClass}>
          {field.label}
        </label>

        <input
          type={
            field.fieldtype ===
            'Date'
              ? 'date'
              : 'text'
          }
          value={value}
          onChange={(e) =>
            handleChange(
              field.fieldname,
              e.target.value
            )
          }
          className={underlineInputClass}
        />
      </>
    )
  }

  if (loadingMeta) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        Loading...
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-start justify-between border-b border-gray-100 px-7 py-5">

          <div className="flex gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
              <Truck className="h-7 w-7 text-cyan-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                New Fleet Vehicle
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Add a vehicle to the fleet
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={
            handleSubmit
          }
          className="flex-1 overflow-y-auto p-7"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">

            {leftFields.map(
              (field) => (
                <div
                  key={
                    field.fieldname
                  }
                  className={
                    field.fieldtype ===
                      'Text' ||
                    field.fieldtype ===
                      'Small Text'
                      ? 'col-span-2'
                      : ''
                  }
                >
                  {renderInput(
                    field
                  )}
                </div>
              )
            )}

          </div>
        </form>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-100 px-7 py-4">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            onClick={
              handleSubmit
            }
            disabled={saving}
            className="rounded-xl bg-cyan-600 px-6 py-2.5 font-semibold text-white"
          >
            {saving
              ? 'Saving...'
              : 'Save Vehicle'}
          </button>

        </div>

      </div>
    </div>
  )
}
