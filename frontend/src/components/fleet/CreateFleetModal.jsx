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
import Button from '../common/Button'
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
            ) &&
            Number(field.show_on_app || 0) === 1
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm">
      <div className="flex h-[95vh] sm:h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-7 sm:py-5 shrink-0">

          <div className="flex items-center gap-3 sm:gap-4 min-w-0">

            <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan-100">
              <Truck className="h-5 w-5 sm:h-7 sm:w-7 text-cyan-600" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold truncate">
                New Fleet Vehicle
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 truncate">
                Add a vehicle to the fleet
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={
            handleSubmit
          }
          className="flex-1 overflow-y-auto p-4 sm:p-7"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

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
                      ? 'col-span-1 sm:col-span-2'
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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 border-t border-gray-100 px-4 py-3 sm:px-7 sm:py-4 shrink-0 bg-white">

          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            loading={saving}
            className="w-full sm:w-auto justify-center"
          >
            Save Vehicle
          </Button>

        </div>

      </div>
    </div>
  )
}
