// components/job-card/CreateJobCardModal.jsx

import { useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import {
  getAllContainers,
  getContainerDetails,
} from '@/services/containerService'

import {
  createJobCard,
  getJobCardMeta,
} from '@/services/jobCardService'

import LinkField from '../common/LinkField'
import Button from '../common/Button'
import {
  labelClass,
  underlineInputClass,
  underlineTextareaClass,
} from '../common/formClasses'

const EXCLUDED_FIELDS = [
  'name',
  'naming_series',
  'amended_from',
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
  'Table',
]

export default function CreateJobCardModal({
  onClose,
  onCreated,
}) {
  const [fields, setFields] = useState([])
  const [tableField, setTableField] = useState(null)

  const [formData, setFormData] = useState({})
  const [containerRows, setContainerRows] = useState([])

  const [loadingMeta, setLoadingMeta] =
    useState(true)

  const [saving, setSaving] = useState(false)

  const [availableContainers, setAvailableContainers] =
  useState([])

 useEffect(() => {
  fetchMeta()
  fetchContainers()
}, [])

  const fetchMeta = async () => {
    try {
      setLoadingMeta(true)

      const meta = await getJobCardMeta()

      const seen = new Set()

      const filteredFields = meta.fields
        .filter((field) => {
          return (
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
        })
        .filter((field) => {
          if (seen.has(field.fieldname))
            return false

          seen.add(field.fieldname)
          return true
        })

      const normalFields = filteredFields.filter(
        (f) => f.fieldtype !== 'Table'
      )

      const childTableField =
        filteredFields.find(
          (f) => f.fieldtype === 'Table'
        )

      setFields(normalFields)
      setTableField(childTableField)

      const initialData = {}

      normalFields.forEach((field) => {
        if (field.fieldtype === 'Check') {
          initialData[field.fieldname] = 0
        } else {
          initialData[field.fieldname] =
            field.default || ''
        }
      })

      setFormData(initialData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMeta(false)
    }
  }

  const leftFields = useMemo(() => {
    return fields.filter(
      (field) =>
        field.fieldtype !== 'Table'
    )
  }, [fields])

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchContainers = async () => {
  try {
    const containers =
      await getAllContainers()

    // This will print the API response in containerService.js
    // and also print the extracted array here.
    console.log(
      'Available Containers:',
      containers
    )

    setAvailableContainers(containers)
  } catch (error) {
    console.error(
      'Error loading containers:',
      error
    )
  }
}

  const handleContainerSelect = async (
  index,
  containerName
) => {
  try {
    // Update selected container immediately
    setContainerRows((prev) => {
      const copy = [...prev]

      copy[index] = {
        ...copy[index],
        container: containerName,
        container_owner: '',
        type: '',
      }

      return copy
    })

    if (!containerName) return

    const details =
      await getContainerDetails(
        containerName
      )

    console.log(
      'Selected Container Details:',
      details
    )

    setContainerRows((prev) => {
      const copy = [...prev]

      copy[index] = {
        ...copy[index],
        container: containerName,
        container_owner:
          details.owner_name || '',
        type:
          details.item || '',
      }

      return copy
    })
  } catch (error) {
    console.error(
      'Failed to fetch container details:',
      error
    )
  }
}
  const addContainerRow = () => {
    setContainerRows((prev) => [
      ...prev,
      {},
    ])
  }

  const removeContainerRow = (index) => {
    setContainerRows((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      const payload = {
        ...formData,
      }

      if (tableField?.fieldname) {
        payload[tableField.fieldname] =
          containerRows
      }

      const created = await createJobCard(
        payload
      )

      onCreated?.(created)

      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to create Job Card')
    } finally {
      setSaving(false)
    }
  }

  const renderInput = (field) => {
    const value =
      formData[field.fieldname] ?? ''

    if (field.fieldtype === 'Check') {
      return (
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) =>
              handleChange(
                field.fieldname,
                e.target.checked ? 1 : 0
              )
            }
            className="h-4 w-4 rounded border-gray-300"
          />

          {field.label}
        </label>
      )
    }

    if (field.fieldtype === 'Link') {
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

    if (field.fieldtype === 'Select') {
      const options =
        field.options
          ?.split('\n')
          ?.filter(Boolean) || []

      return (
        <>
          <label className={labelClass}>
            {field.label}

            {/* {field.reqd && (
              <span className="text-red-500">
                {' '}
                *
              </span>
            )} */}
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
              Select {field.label}
            </option>

            {options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </>
      )
    }

    const inputType =
      field.fieldtype === 'Date'
        ? 'date'
        : field.fieldtype === 'Datetime'
        ? 'datetime-local'
        : 'text'

    if (
      field.fieldtype === 'Small Text' ||
      field.fieldtype === 'Text'
    ) {
      return (
        <>
          <label className={labelClass}>
            {field.label}

            {/* {field.reqd && (
              <span className="text-red-500">
                {' '}
                *
              </span>
            )} */}
          </label>

          <textarea
            rows={3}
            value={value}
            placeholder={`Enter ${field.label?.toLowerCase()}`}
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

          {/* {field.reqd && (
            <span className="text-red-500">
              {' '}
              *
            </span>
          )} */}
        </label>

        <div className="relative">
          {field.fieldtype === 'Link' && (
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          )}

          <input
  type={inputType}
  value={value}
  placeholder={`Enter ${field.label?.toLowerCase()}`}
  onChange={(e) =>
    handleChange(
      field.fieldname,
      e.target.value
    )
  }
  className={underlineInputClass}
/>
        </div>
      </>
    )
  }

  if (loadingMeta) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="rounded-2xl bg-white px-6 py-5 shadow-xl">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-gray-100 px-7 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
              <ClipboardList className="h-7 w-7 text-orange-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                New Job Card
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create a job card to schedule
                transport or storage services
                for a customer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <form
  onSubmit={handleSubmit}
  className="flex min-h-0 flex-1 overflow-hidden"
>
  {/* LEFT SIDE */}
  <div className="w-1/2 overflow-y-auto px-8 py-5">
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      {leftFields.map((field) => {
        const isTextArea =
          field.fieldtype === 'Text' ||
          field.fieldtype === 'Small Text'

        return (
          <div
            key={field.fieldname}
            className={
              isTextArea ? 'col-span-2' : ''
            }
          >
            {renderInput(field)}
          </div>
        )
      })}
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="w-1/2 border-l border-gray-100 bg-gray-50/50 px-6 py-6 overflow-y-auto">
    <div className="border-b border-slate-200 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Containers
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Add container entries for this
            job card.
          </p>
        </div>

        <Button
          onClick={addContainerRow}
          variant="outline"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
        >
          Add Container
        </Button>
      </div>

      {/* TABLE HEADER */}
      <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
        <div className="
  grid
  grid-cols-12
  bg-slate-50
  px-3
  py-2
  text-[11px]
  font-semibold
  uppercase
  tracking-wide
 text-center
 text-gray-600">
          <div className="col-span-4">
            Container Name
          </div>

          <div className="col-span-4">
            Owner
          </div>

          <div className="col-span-3">
            Type / Status
          </div>

          <div className="col-span-1"></div>
        </div>

        {/* TABLE BODY */}
        <div className="divide-y divide-gray-100">
          {containerRows.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              No containers added yet
            </div>
          )}

          {containerRows.map((row, index) => (
  <div
    key={index}
    className="grid grid-cols-12 gap-2 px-3 py-2"
  >
    {/* Container Dropdown */}
    <div className="col-span-4">
      <select
        value={row.container || ''}
        onChange={(e) =>
          handleContainerSelect(
            index,
            e.target.value
          )
        }
        className=" h-10
    w-full
    border-0
    border-b
    border-slate-300
    bg-transparent
    px-0
    text-sm
    focus:border-[#006B82]"
      >
        <option value="">
          Select Container
        </option>

       {availableContainers
  .filter((container) => {
    // Only Available containers
    if (
      container.status !== 'Available'
    ) {
      return false
    }

    // Allow current row's selected container
    if (
      row.container ===
      container.name
    ) {
      return true
    }

    // Prevent duplicates from other rows
    return !containerRows.some(
      (r, rowIndex) =>
        rowIndex !== index &&
        r.container ===
          container.name
    )
  })
  .map((container) => (
    <option
      key={container.name}
      value={container.name}
    >
      {container.container_number}
    </option>
  ))}
      </select>
    </div>

    {/* Owner Column */}
    <div className="col-span-4">
      <input
        type="text"
        readOnly
        placeholder="Owner"
        value={row.container_owner || ''}
        className="
  h-10
  w-full
  border-0
  border-b
  border-slate-300
  bg-transparent
  px-0
  text-sm
  text-gray-700
  rounded-none
  outline-none
"
      />
    </div>

    {/* Type Column */}
    <div className="col-span-3">
      <input
        type="text"
        readOnly
        placeholder="Type"
        value={row.type || ''}
        className="
  h-10
  w-full
  border-0
  border-b
  border-slate-300
  bg-transparent
  px-0
  text-sm
  text-gray-700
  rounded-none
  outline-none
"
      />
    </div>

    {/* Delete Button */}
    <div className="col-span-1 flex items-center justify-center">
      <button
        type="button"
        onClick={() =>
          removeContainerRow(index)
        }
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </div>
))}
        </div>
      </div>
    </div>

    {/* SUMMARY */}
  
<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5">
  <h4 className="text-sm font-semibold text-gray-700">
    Summary
  </h4>

  <p className="mt-2 text-sm text-gray-500">
    {
      // Count only rows where a container has actually been selected
      containerRows.filter(
        (row) =>
          row.container &&
          String(row.container).trim() !== ''
      ).length
    }{' '}
    container
    {containerRows.filter(
      (row) =>
        row.container &&
        String(row.container).trim() !== ''
    ).length !== 1
      ? 's'
      : ''}{' '}
    selected
  </p>
</div>
  </div>
</form>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-7 py-4">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            onClick={handleSubmit}
            loading={saving}
          >
            Save Job Card
          </Button>
        </div>
      </div>
    </div>
  )
}
