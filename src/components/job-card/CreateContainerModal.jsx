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
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-xl
          shadow-xl
          w-full
          max-w-5xl
          overflow-hidden
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            border-b border-slate-200
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10
                rounded-lg
                bg-cyan-50
                flex items-center justify-center
                text-cyan-600
              "
            >
              <Package size={18} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-800">
                Create Container
              </h2>

              <p className="text-xs text-slate-500">
                ERPNext Metadata Driven Form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!meta ? (
            <div className="text-center text-sm text-slate-500">
              Loading form metadata...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
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
            px-6 py-4
            border-t border-slate-200
            flex justify-end gap-3
          "
        >
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              loading || !meta
            }
          >
            {loading
              ? 'Creating...'
              : 'Create Container'}
          </Button>
        </div>
      </div>
    </div>
  )
}