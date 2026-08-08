import { useEffect, useState } from 'react'
import { X, Package } from 'lucide-react'

import Button from '@/components/common/Button'
import MetaField from '@/components/common/MetaField'

import {
  createContainer,
  getContainerMeta,
} from '@/services/containerService'

export default function CreateContainerModal({
  onClose,
  onCreated,
}) {
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const data = await getContainerMeta()
        setMeta(data)
      } catch (error) {
        console.error(error)
      }
    }

    loadMeta()
  }, [])

  const excludedFields = [
    'name',
    'owner',
    'creation',
    'modified',
    'modified_by',
    'docstatus',
    'idx',
    '_assign',
    '_comments',
    '_liked_by',
    '_user_tags',
  ]

  const fields =
    meta?.fields?.filter(
      (field) =>
        field.fieldtype &&
        ![
          'Section Break',
          'Column Break',
          'Tab Break',
          'HTML',
          'Button',
          'Fold',
        ].includes(field.fieldtype) &&
        !excludedFields.includes(
          field.fieldname
        ) &&
        !field.hidden &&
        !field.read_only
    ) || []

  const handleChange = (
    fieldname,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldname]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload = {}

      Object.keys(formData).forEach(
        (key) => {
          const value = formData[key]

          if (
            value !== '' &&
            value !== null &&
            value !== undefined
          ) {
            payload[key] = value
          }
        }
      )

      const container =
        await createContainer(payload)

      onCreated?.(container)
    } catch (error) {
      console.error(error)

      alert(
        error?.response?.data?.exception ||
          error?.response?.data?.message ||
          'Failed to create container'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        backdrop-blur-sm
        flex items-center justify-center
        p-2 sm:p-4
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-xl
          w-full
          max-w-5xl
          overflow-hidden
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-4 py-3.5 sm:px-6 sm:py-4
            border-b border-slate-200
            shrink-0
          "
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="
                w-9 h-9 sm:w-10 sm:h-10
                rounded-xl
                bg-cyan-50
                flex items-center justify-center
                text-cyan-600
                shrink-0
              "
            >
              <Package size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-slate-800 text-base sm:text-lg truncate">
                Create Container
              </h2>

              <p className="text-xs text-slate-500 truncate">
                Add a new container record into the system.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!meta ? (
            <div className="text-center text-sm text-slate-500">
              Loading form metadata...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {fields.map((field) => (
                <MetaField
                  key={field.fieldname}
                  field={field}
                  value={
                    formData[
                      field.fieldname
                    ]
                  }
                  formData={formData}
                  readOnly={false}
                  tableMeta={{}}
                  onChange={
                    handleChange
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="
            px-4 py-3 sm:px-6 sm:py-4
            border-t border-slate-200
            flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3
            shrink-0 bg-white
          "
        >
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto justify-center"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!meta}
            loading={loading}
            className="w-full sm:w-auto justify-center"
          >
            Create Container
          </Button>
        </div>
      </div>
    </div>
  )
}