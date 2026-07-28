// src/pages/containers/ContainerDetailsModal.jsx

import { X, Package } from 'lucide-react'
import { formatDate } from '@/utils/date' 

export default function ContainerDetailsModal({ container, onClose }) {
  const fields = [
    {
      label: 'Container Number',
      value: container.container_number,
    },
    {
      label: 'Container Type',
      value: container.item,
    },
    {
      label: 'Size',
      value: container.size ? `${container.size} FT` : '-',
    },
    {
      label: 'Owner',
      value: container.owner_name,
    },
    {
      label: 'Status',
      value: container.status,
    },
    {
      label: 'Created On',
      /* FIXED: Wrapped the raw timestamp in our global format function */
      value: formatDate(container.creation),
    },
    {
      label: 'ISO Code',
      value: container.iso_code,
    },
    {
      label: 'Rating',
      value: container.rating,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#006B82]/10 flex items-center justify-center text-[#006B82]">
              <Package size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Container Details</h2>
              <p className="text-sm text-slate-500 mt-1">{container.container_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-slate-50/40 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fields.map((field, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  {field.label}
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800 break-words">
                  {field.value || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}