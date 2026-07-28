import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  UserCheck,
  Search,
  X,
} from 'lucide-react'

import LinkField from '../common/LinkField'
import api from '@/config/api'
import {
  labelClass,
  underlineInputClass,
  underlineTextareaClass,
} from '../common/formClasses'

import {
  getDriverMeta,
  createDriver,
} from '@/services/driverService'

const EXCLUDED_FIELDS = [
  'name',
  'naming_series',
  'owner',
  'creation',
  'modified',
  'modified_by',
  'docstatus',
  'idx',
  'parent',
  'parentfield',
  'parenttype',
]

const SUPPORTED_FIELD_TYPES = [
  'Data',
  'Small Text',
  'Text',
  'Select',
  'Date',
  'Datetime',
  'Check',
  'Link',
  'Attach',
]

export default function CreateDriverModal({
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
      const meta =
        await getDriverMeta()

      console.log(
        'Driver Meta:',
        meta
      )

      const filtered =
        meta.fields.filter(
          (field) =>
            SUPPORTED_FIELD_TYPES.includes(
              field.fieldtype
            ) &&
            field.fieldname &&
            !field.hidden &&
            !field.read_only &&
            !field.is_virtual &&
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

  const leftFields = useMemo(
    () => fields,
    [fields]
  )

  const handleChange = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault()

    try {
      setSaving(true)

      console.log(
        'Driver Payload:',
        formData
      )

      const created =
        await createDriver(
          formData
        )

      onCreated?.(created)

      onClose()
    } catch (error) {
      console.error(error)

      alert(
        'Failed to create Driver'
      )
    } finally {
      setSaving(false)
    }
  }

  const renderInput = (
    field
  ) => {
    const value =
      formData[
        field.fieldname
      ] ?? ''

    if (
      field.fieldtype ===
      'Check'
    ) {
      return (
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
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

          {field.label}
        </label>
      )
    }

    if (
  field.fieldtype ===
  'Link'
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
if (field.fieldtype === 'Attach') {
  return (
    <>
      <label className={labelClass}>
        {field.label}
      </label>

      <label
        className="
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
        "
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
              {value
                ? value.split('/').pop()
                : 'Choose File'}
            </p>

            <p className="text-xs text-slate-500">
              JPG, PNG, JPEG
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
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file =
              e.target.files?.[0]

            if (!file) return

            try {
              const uploadData =
                new FormData()

              uploadData.append(
                'file',
                file
              )

              uploadData.append(
                'is_private',
                0
              )

              const response =
                await api.post(
                  '/method/upload_file',
                  uploadData,
                  {
                    headers: {
                      'Content-Type':
                        'multipart/form-data',
                    },
                  }
                )

              const fileUrl =
                response.data?.message
                  ?.file_url

              handleChange(
                field.fieldname,
                fileUrl
              )
            } catch (error) {
              console.error(
                'Upload failed',
                error
              )

              alert(
                'Failed to upload file'
              )
            }
          }}
        />
      </label>

      {value && (
        <div className="mt-3 flex justify-center">
          <img
            src={value}
            alt="Preview"
            className="
              h-24
              w-24
              rounded-full
              object-cover
              border-2
              border-slate-200
              shadow-sm
            "
          />
        </div>
      )}
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
              Select{' '}
              {field.label}
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
              : field.fieldtype ===
                'Datetime'
              ? 'datetime-local'
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
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b px-7 py-5">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
              <UserCheck className="h-7 w-7 text-cyan-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Driver Onboarding
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Register a new
                driver into the
                transport system.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}

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
                >
                  {renderInput(
                    field
                  )}
                </div>
              )
            )}
          </div>
        </form>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t px-7 py-4">
          <button
            onClick={onClose}
            type="button"
            className="rounded-xl border border-gray-200 px-5 py-2.5"
          >
            Cancel
          </button>

          <button
            onClick={
              handleSubmit
            }
            disabled={saving}
            className="rounded-xl bg-[#006B82] px-6 py-2.5 font-semibold text-white"
          >
            {saving
              ? 'Saving...'
              : 'Save Driver'}
          </button>
        </div>
      </div>
    </div>
  )
}
